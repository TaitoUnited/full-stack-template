import { env } from 'node:process';

import {
  runVitest,
  setupTestDatabase,
  setupTestServer,
  wasCausedByAbort,
} from './run-test.utils';

async function runTests() {
  const mode = env.MODE;

  if (mode !== 'integration' && mode !== 'api') {
    throw new Error(
      `Server tests must be run with MODE=integration or MODE=api, but got ${mode}`
    );
  }

  const testName = process.argv[2];
  const abortController = new AbortController();

  function stopOnSignal(signal: NodeJS.Signals) {
    if (abortController.signal.aborted) {
      return;
    }

    process.exitCode = signal === 'SIGINT' ? 130 : 143;
    abortController.abort(new Error(`Received ${signal}`));
  }

  process.once('SIGINT', stopOnSignal);
  process.once('SIGTERM', stopOnSignal);

  try {
    const { cleanupDatabase, databaseName } = await setupTestDatabase({
      abortSignal: abortController.signal,
    });

    try {
      if (mode === 'api') {
        await runApiTests({
          testName,
          databaseName,
          abortSignal: abortController.signal,
        });
      } else {
        await runIntegrationTests({
          testName,
          databaseName,
          abortSignal: abortController.signal,
        });
      }
    } finally {
      await cleanupDatabase();
    }
  } catch (error) {
    if (!wasCausedByAbort({ error, abortSignal: abortController.signal })) {
      throw error;
    }
  } finally {
    process.removeListener('SIGINT', stopOnSignal);
    process.removeListener('SIGTERM', stopOnSignal);
  }
}

async function runIntegrationTests({
  testName,
  databaseName,
  abortSignal,
}: {
  testName: string | undefined;
  databaseName: string;
  abortSignal: AbortSignal;
}) {
  const testEnvironment: NodeJS.ProcessEnv = {
    ...env,
    COMMON_ENV: 'test',
    DATABASE_NAME: databaseName,
    MODE: 'integration',
  };

  // CI may point this at a deployed application; integration tests must not.
  delete testEnvironment.TEST_BASE_URL;

  await runVitest({ testName, testEnvironment, abortSignal });
}

async function runApiTests({
  testName,
  databaseName,
  abortSignal,
}: {
  testName: string | undefined;
  databaseName: string;
  abortSignal: AbortSignal;
}) {
  const { cleanupTestServer, apiEnvironment } = await setupTestServer({
    databaseName,
    abortSignal,
  });

  try {
    await runVitest({
      testName,
      testEnvironment: { ...apiEnvironment, MODE: 'api' },
      abortSignal,
    });
  } finally {
    await cleanupTestServer();
  }
}

void runTests().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
