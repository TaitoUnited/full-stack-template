import config, { readSecret } from '../../src/common/setup/config';

let testConfig: any = null;

const getTestConfig = async () => {
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
};

export default getTestConfig;
