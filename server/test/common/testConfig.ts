import config, { getSecrets } from '../../src/common/config';

let testConfig = null;

const getTestConfig = async () => {
  if (testConfig) {
    return testConfig;
  }

  const secrets = await getSecrets();
  if (!testConfig) {
    testConfig = {
      DATABASE_HOST: config.DATABASE_HOST,
      DATABASE_PORT: config.DATABASE_PORT,
      DATABASE_NAME: config.DATABASE_NAME,
      DATABASE_USER: config.DATABASE_USER,
      DATABASE_PASSWORD: secrets.DATABASE_PASSWORD,
      DATABASE_POOL_MAX: config.DATABASE_POOL_MAX,
      DATABASE_SSL_ENABLED: config.DATABASE_SSL_ENABLED,
      DATABASE_SSL_CLIENT_CERT_ENABLED: config.DATABASE_SSL_CLIENT_CERT_ENABLED,
      DATABASE_SSL_SERVER_CERT_ENABLED: config.DATABASE_SSL_SERVER_CERT_ENABLED,
      DATABASE_SSL_CA: secrets.DATABASE_SSL_CA,
      DATABASE_SSL_CERT: secrets.DATABASE_SSL_CERT,
      DATABASE_SSL_KEY: secrets.DATABASE_SSL_KEY,
    };
  }

  return testConfig;
};

export default getTestConfig;
