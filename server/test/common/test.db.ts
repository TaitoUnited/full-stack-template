import pgpInit, { IDatabase } from 'pg-promise';
import { getDatabaseSSL } from '../../src/common/setup/config';
import getTestConfig from './test.config';

let testDb: IDatabase<Record<string, unknown>> | null = null;

const getTestDb = async () => {
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
};

export default getTestDb;
