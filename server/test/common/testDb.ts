import pgpInit, { IDatabase } from 'pg-promise';
import getTestConfig from './testConfig';

let testDb: IDatabase<{}> | null = null;

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
      ssl:
        testConfig.DATABASE_SSL_ENABLED &&
        testConfig.DATABASE_SSL_CLIENT_CERT_ENABLED
          ? {
              ca: testConfig.DATABASE_SSL_CA,
              cert: testConfig.DATABASE_SSL_CERT,
              key: testConfig.DATABASE_SSL_KEY,
            }
          : // TODO: enable once it works with AWS CI/CD
          // : testConfig.DATABASE_SSL_ENABLED &&
          //   testConfig.DATABASE_SSL_SERVER_CERT_ENABLED
          // ? {
          //     ca: testConfig.DATABASE_SSL_CA,
          //   }
          testConfig.DATABASE_SSL_ENABLED
          ? { rejectUnauthorized: false }
          : false,
    };

    testDb = pgp(cn);
  }

  return testDb;
};

export default testDb;
