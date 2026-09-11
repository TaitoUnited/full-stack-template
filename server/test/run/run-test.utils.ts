import { type ChildProcess, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import { env } from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';

import { type PoolConfig, Pool } from 'pg';

import { config, getDatabaseSSL, getSecrets } from '~/src/utils/config';

import {
  TEST_DATABASE_PREFIX,
  TEST_SERVER_START_TIMEOUT_MS,
  TEST_SERVER_STOP_TIMEOUT_MS,
} from './run-test.constants';

export async function runVitest({
  testName,
  testEnvironment,
  abortSignal,
}: {
  testName: string | undefined;
  testEnvironment: NodeJS.ProcessEnv;
  abortSignal: AbortSignal;
}) {
  const vitestArguments = ['run'];

  if (testName) {
    vitestArguments.push(testName);
  }

  await runCommand({
    command: './node_modules/.bin/vitest',
    commandArguments: vitestArguments,
    commandEnvironment: testEnvironment,
    abortSignal,
  });
}

/** Starts an isolated API server on a random available port. */
export async function setupTestServer({
  databaseName,
  abortSignal,
}: {
  databaseName: string;
  abortSignal: AbortSignal;
}) {
  const port = await findAvailablePort();
  const testServerUrl = `http://127.0.0.1:${port}`;

  const apiEnvironment: NodeJS.ProcessEnv = {
    ...env,
    API_BINDADDR: '127.0.0.1',
    API_PORT: port.toString(),
    COMMON_URL: testServerUrl,
    COMMON_ENV: 'test',
    API_DOCS_ENABLED: 'false',
    API_PLAYGROUND_ENABLED: 'false',
    DATABASE_NAME: databaseName,
  };

  // CI may set this to the deployed application. API tests must use this server.
  delete apiEnvironment.TEST_BASE_URL;

  console.log(
    `Starting isolated API test server at ${testServerUrl} with database ${databaseName}...`
  );

  const testServer = spawn(
    './node_modules/.bin/tsx',
    ['./test/run/run-test-server.ts'],
    {
      env: { ...apiEnvironment, COMMON_LOG_LEVEL: 'warn' },
      stdio: 'inherit',
    }
  );

  function stopOnAbort() {
    testServer.kill('SIGTERM');
  }

  abortSignal.addEventListener('abort', stopOnAbort, { once: true });

  try {
    await waitForTestServer({
      testServer,
      healthUrl: `${testServerUrl}/healthz`,
      abortSignal,
    });
  } catch (error) {
    abortSignal.removeEventListener('abort', stopOnAbort);
    await stopTestServer(testServer);
    throw error;
  }

  async function cleanupTestServer() {
    console.log(`Stopping isolated API test server at ${testServerUrl}...`);
    abortSignal.removeEventListener('abort', stopOnAbort);
    await stopTestServer(testServer);
  }

  return { cleanupTestServer, apiEnvironment };
}

/** Creates and migrates a uniquely named database that is dropped after the run. */
export async function setupTestDatabase({
  abortSignal,
}: {
  abortSignal: AbortSignal;
}) {
  const databaseName = createTestDatabaseName();
  const adminPool = await createAdminPool();
  let databaseCreated = false;

  async function cleanupDatabase() {
    try {
      if (databaseCreated) {
        console.log(`Dropping disposable test database ${databaseName}...`);
        await adminPool.query(
          `DROP DATABASE IF EXISTS ${quoteTestDatabaseName(databaseName)} WITH (FORCE)`
        );
      }
    } finally {
      await adminPool.end();
    }
  }

  try {
    console.log(`Creating disposable test database ${databaseName}...`);
    await adminPool.query(
      `CREATE DATABASE ${quoteTestDatabaseName(databaseName)} TEMPLATE template0`
    );

    databaseCreated = true;

    console.log(`Migrating disposable test database ${databaseName}...`);
    await runCommand({
      command: './node_modules/.bin/tsx',
      commandArguments: ['./db/migrate.ts'],
      commandEnvironment: { ...env, DATABASE_NAME: databaseName },
      abortSignal,
    });
  } catch (error) {
    await cleanupDatabase();
    throw error;
  }

  return { cleanupDatabase, databaseName };
}

async function findAvailablePort() {
  const portServer = createServer();

  await new Promise<void>((resolve, reject) => {
    portServer.once('error', reject);
    portServer.listen({ host: '127.0.0.1', port: 0 }, resolve);
  });

  const address = portServer.address();

  if (!address || typeof address === 'string') {
    portServer.close();
    throw new Error('Failed to allocate a port for the API test server');
  }

  await new Promise<void>((resolve, reject) => {
    portServer.close((error) => (error ? reject(error) : resolve()));
  });

  return address.port;
}

async function waitForTestServer({
  testServer,
  healthUrl,
  abortSignal,
}: {
  testServer: ChildProcess;
  healthUrl: string;
  abortSignal: AbortSignal;
}) {
  const deadline = Date.now() + TEST_SERVER_START_TIMEOUT_MS;
  let startError: Error | undefined;

  function recordStartError(error: Error) {
    startError = error;
  }

  testServer.once('error', recordStartError);

  try {
    while (Date.now() < deadline) {
      throwIfAborted(abortSignal, 'API test server startup was aborted');

      if (startError) {
        throw new Error('Failed to start API test server', {
          cause: startError,
        });
      }

      if (testServer.exitCode !== null || testServer.signalCode !== null) {
        throw new Error(
          `API test server exited before becoming ready with ${testServer.signalCode ? `signal ${testServer.signalCode}` : `code ${testServer.exitCode}`}`
        );
      }

      try {
        const response = await fetch(healthUrl, {
          signal: AbortSignal.timeout(1_000),
        });

        if (response.ok) {
          return;
        }
      } catch {
        // The server is expected to refuse connections briefly while starting.
      }

      await delay(100, undefined, { signal: abortSignal });
    }
  } finally {
    testServer.removeListener('error', recordStartError);
  }

  throw new Error(`API test server did not become ready at ${healthUrl}`);
}

async function stopTestServer(testServer: ChildProcess) {
  if (testServer.exitCode !== null || testServer.signalCode !== null) {
    return;
  }

  testServer.kill('SIGTERM');

  if (await waitForTestServerExit(testServer, TEST_SERVER_STOP_TIMEOUT_MS)) {
    return;
  }

  testServer.kill('SIGKILL');

  if (!(await waitForTestServerExit(testServer, TEST_SERVER_STOP_TIMEOUT_MS))) {
    throw new Error('API test server did not stop after SIGKILL');
  }
}

function waitForTestServerExit(testServer: ChildProcess, timeoutMs: number) {
  if (testServer.exitCode !== null || testServer.signalCode !== null) {
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    function finish() {
      clearTimeout(timeout);
      resolve(true);
    }

    const timeout = setTimeout(() => {
      testServer.removeListener('exit', finish);
      resolve(false);
    }, timeoutMs);

    testServer.once('exit', finish);
  });
}

function createTestDatabaseName() {
  const timestamp = Date.now().toString(36);
  const randomSuffix = randomUUID().replaceAll('-', '').slice(0, 8);
  return `${TEST_DATABASE_PREFIX}${timestamp}_${process.pid}_${randomSuffix}`;
}

function quoteTestDatabaseName(databaseName: string) {
  const testDatabasePattern = /^full_stack_template_test_[a-z0-9_]+$/;

  if (
    !testDatabasePattern.test(databaseName) ||
    databaseName.length > 63 ||
    databaseName === config.DATABASE_NAME
  ) {
    throw new Error(`Refusing to manage unsafe test database ${databaseName}`);
  }

  return `"${databaseName}"`;
}

async function createAdminPool() {
  const secrets = await getSecrets();

  const adminPoolConfig: PoolConfig = {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    database: 'postgres',
    user: config.DATABASE_USER,
    password: secrets.DATABASE_PASSWORD ?? '',
    ssl: getDatabaseSSL(config, secrets),
    max: 1,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    statement_timeout: 30_000,
    application_name: `full-stack-template-test-admin-${process.pid}`,
  };

  return new Pool(adminPoolConfig);
}

async function runCommand({
  command,
  commandArguments,
  commandEnvironment,
  abortSignal,
}: {
  command: string;
  commandArguments: string[];
  commandEnvironment: NodeJS.ProcessEnv;
  abortSignal: AbortSignal;
}) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, commandArguments, {
      env: commandEnvironment,
      signal: abortSignal,
      stdio: 'inherit',
    });

    child.once('error', (error) => {
      reject(abortSignal.aborted ? getAbortError(abortSignal) : error);
    });

    child.once('exit', (code, signal) => {
      if (abortSignal.aborted) {
        reject(getAbortError(abortSignal));
      } else if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `${command} exited with ${signal ? `signal ${signal}` : `code ${code}`}`
          )
        );
      }
    });
  });
}

function throwIfAborted(abortSignal: AbortSignal, message: string) {
  if (!abortSignal.aborted) {
    return;
  }

  throw getAbortError(abortSignal, message);
}

function getAbortError(
  abortSignal: AbortSignal,
  message = 'Command was aborted'
) {
  const reason: unknown = abortSignal.reason;
  return reason instanceof Error
    ? reason
    : new Error(message, { cause: reason });
}

export function wasCausedByAbort({
  error,
  abortSignal,
}: {
  error: unknown;
  abortSignal: AbortSignal;
}) {
  return (
    abortSignal.aborted &&
    (error === abortSignal.reason ||
      (error instanceof Error && error.cause === abortSignal.reason))
  );
}
