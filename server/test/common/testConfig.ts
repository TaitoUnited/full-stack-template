import config from '../../src/common/config';

const testConfig = {
  // Database
  DATABASE_HOST: config.DATABASE_HOST,
  DATABASE_PORT: config.DATABASE_PORT,
  DATABASE_NAME: config.DATABASE_NAME,
  DATABASE_USER: config.DATABASE_USER,
  DATABASE_PASSWORD: config.DATABASE_PASSWORD,
  DATABASE_POOL_MAX: config.DATABASE_POOL_MAX,
};

export default testConfig;
