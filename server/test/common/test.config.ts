import config, { readSecret } from '../../src/common/setup/config';

let testConfig: any = null;

const getTestConfig = async () => {
  if (testConfig) {
    return testConfig;
  }

  const c = {
    TEST_API_URL: process.env.TEST_API_URL,

    DATABASE_HOST: config.DATABASE_HOST,
    DATABASE_PORT: config.DATABASE_PORT,
    DATABASE_NAME: config.DATABASE_NAME,
    DATABASE_USER: config.DATABASE_USER,
    DATABASE_PASSWORD: await readSecret('DATABASE_PASSWORD'),
    DATABASE_POOL_MAX: config.DATABASE_POOL_MAX,
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

    AUTH0_AUDIENCE: config.AUTH0_AUDIENCE,
    AUTH0_DOMAIN: config.AUTH0_DOMAIN,
    AUTH0_TEST_CLIENT_ID: process.env.AUTH0_TEST_CLIENT_ID,
    AUTH0_TEST_CLIENT_SECRET: await readSecret('AUTH0_TEST_CLIENT_SECRET'),

    TEST_USER1_USERNAME: process.env.TEST_USER1_USERNAME,
    TEST_USER1_PASSWORD: await readSecret('TEST_USER1_PASSWORD'),
  };

  if (!testConfig) {
    testConfig = c;
  }

  return testConfig;
};

export default getTestConfig;
