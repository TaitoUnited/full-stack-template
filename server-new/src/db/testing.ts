import pgpInit, { IDatabase } from 'pg-promise';

import { config, getDatabaseSSL, readSecret } from '~/utils/config';

let testDb: IDatabase<Record<string, unknown>> | null = null;

export async function getTestDb() {
  if (testDb) {
    return testDb;
  }

  const testConfig = await getTestConfig();

  if (!testDb) {
    // Initialize DB
    const pgp = pgpInit({
      // Initialization options
    });

    const cn = {
      host: testConfig.DATABASE_HOST,
      port: testConfig.DATABASE_PORT,
      database: testConfig.DATABASE_NAME,
      user: testConfig.DATABASE_USER,
      password: testConfig.DATABASE_PASSWORD,
      poolSize: testConfig.DATABASE_POOL_MAX,
      ssl: getDatabaseSSL(testConfig, testConfig),
      statement_timeout: testConfig.DATABASE_STATEMENT_TIMEOUT,
    };

    testDb = pgp(cn);
  }

  return testDb;
}

let testConfig: any = null;

async function getTestConfig() {
  if (testConfig) {
    return testConfig;
  }

  const c = {
    DATABASE_HOST: config.DATABASE_HOST,
    DATABASE_PORT: config.DATABASE_PORT,
    DATABASE_NAME: config.DATABASE_NAME,
    DATABASE_USER: config.DATABASE_USER,
    DATABASE_PASSWORD: await readSecret('DATABASE_PASSWORD'),
    DATABASE_POOL_MAX: config.DATABASE_POOL_MAX,
    DATABASE_STATEMENT_TIMEOUT: config.DATABASE_STATEMENT_TIMEOUT,
    DATABASE_SSL_ENABLED: config.DATABASE_SSL_ENABLED,
    DATABASE_SSL_CLIENT_CERT_ENABLED: config.DATABASE_SSL_CLIENT_CERT_ENABLED,
    DATABASE_SSL_SERVER_CERT_ENABLED: config.DATABASE_SSL_SERVER_CERT_ENABLED,
    DATABASE_SSL_CA:
      config.DATABASE_SSL_CLIENT_CERT_ENABLED ||
      config.DATABASE_SSL_SERVER_CERT_ENABLED
        ? await readSecret('DATABASE_SSL_CA')
        : null,
    DATABASE_SSL_CERT: config.DATABASE_SSL_CLIENT_CERT_ENABLED
      ? await readSecret('DATABASE_SSL_CERT')
      : null,
    DATABASE_SSL_KEY: config.DATABASE_SSL_CLIENT_CERT_ENABLED
      ? await readSecret('DATABASE_SSL_KEY')
      : null,
  };

  if (!testConfig) {
    testConfig = c;
  }

  return testConfig;
}
