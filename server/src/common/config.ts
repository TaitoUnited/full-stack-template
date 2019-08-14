import fs from 'fs';

export const readFileSync = (path: string) => {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (err) {
    return undefined;
  }
};

export const readSecretSync = (secret: string) => {
  const value = readFileSync(`/run/secrets/${secret}`);
  // tslint:disable-next-line
  if (!value) console.warn(`WARNING: Failed to read secret ${secret}`);
  return value;
};

const config = {
  // Environment
  COMMON_PROJECT: process.env.COMMON_PROJECT,
  COMMON_COMPANY: process.env.COMMON_COMPANY,
  COMMON_FAMILY: process.env.COMMON_FAMILY,
  COMMON_APPLICATION: process.env.COMMON_APPLICATION,
  COMMON_SUFFIX: process.env.COMMON_SUFFIX,
  COMMON_DOMAIN: process.env.COMMON_DOMAIN,
  COMMON_IMAGE_TAG: process.env.COMMON_IMAGE_TAG,
  COMMON_ENV: process.env.COMMON_ENV, // dev / test / stag / prod
  NODE_ENV: process.env.NODE_ENV, // development / production

  // Basic
  ROOT_PATH: __dirname,
  APP_NAME: 'full-stack-template-server',
  DEBUG: Boolean(process.env.COMMON_DEBUG),
  APP_VERSION: !process.env.BUILD_IMAGE_TAG
    ? `${process.env.BUILD_VERSION}+local`
    : `${process.env.BUILD_VERSION}+${process.env.BUILD_IMAGE_TAG}`,
  API_PORT: parseInt(process.env.API_PORT as string, 10),
  API_BINDADDR: process.env.API_BINDADDR,

  // Cache
  CACHE_HOST: process.env.CACHE_HOST as string,
  CACHE_PORT: parseInt(process.env.CACHE_PORT as string, 10),

  // Sentry
  APP_SENTRY_DSN: process.env.APP_SENTRY_DSN,

  // Database
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: readSecretSync('DATABASE_PASSWORD'),
  DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX
    ? parseInt(process.env.DATABASE_POOL_MAX, 10)
    : 10,

  // Storage
  S3_URL: process.env.S3_URL,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_KEY_ID: process.env.S3_KEY_ID,
  S3_KEY_SECRET: readSecretSync('S3_KEY_SECRET'),
  S3_FORCE_PATH_STYLE: Boolean(process.env.S3_FORCE_PATH_STYLE),

  // Logging
  COMMON_LOG_LEVEL: process.env.COMMON_LOG_LEVEL,
  COMMON_LOG_FORMAT: process.env.COMMON_LOG_FORMAT,
};

export default config;
