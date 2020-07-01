import fs from 'fs';

export const readFileSync = (path: string) => {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (err) {
    return undefined;
  }
};

export const readSecretSync = (secret: string) => {
  if (process.env[secret]) {
    return process.env[secret];
  } else if (process.env[`${secret}_PARAM`]) {
    // TODO: read secret from external secret store
  } else {
    const value = readFileSync(`/run/secrets/${secret}`);
    // tslint:disable-next-line
    if (!value) console.warn(`WARNING: Failed to read secret ${secret}`);
    return value;
  }
};

const useClientCert = process.env.DATABASE_SSL_CLIENT_CERT_ENABLED === 'true';

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
  DATABASE_SSL_ENABLED: process.env.DATABASE_SSL_ENABLED !== 'false',
  DATABASE_SSL_CLIENT_CERT_ENABLED: useClientCert,
  DATABASE_SSL_CA: useClientCert
    ? readSecretSync('DATABASE_SSL_CA')
    : undefined,
  DATABASE_SSL_CERT: useClientCert
    ? readSecretSync('DATABASE_SSL_CERT')
    : undefined,
  DATABASE_SSL_KEY: useClientCert
    ? readSecretSync('DATABASE_SSL_KEY')
    : undefined,
  // Redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379,
  REDIS_PASSWORD: readSecretSync('REDIS_PASSWORD'),
  // Storage
  BUCKET_URL: process.env.BUCKET_URL || undefined,
  BUCKET_REGION: process.env.BUCKET_REGION,
  BUCKET_BUCKET: process.env.BUCKET_BUCKET as string,
  BUCKET_BROWSE_URL: process.env.BUCKET_BROWSE_URL as string,
  BUCKET_DOWNLOAD_URL: process.env.BUCKET_DOWNLOAD_URL as string,
  BUCKET_KEY_ID: process.env.BUCKET_KEY_ID,
  BUCKET_KEY_SECRET: readSecretSync('BUCKET_KEY_SECRET'),
  BUCKET_FORCE_PATH_STYLE: Boolean(process.env.BUCKET_FORCE_PATH_STYLE),

  // Logging
  COMMON_LOG_LEVEL: process.env.COMMON_LOG_LEVEL,
  COMMON_LOG_FORMAT: process.env.COMMON_LOG_FORMAT as 'text' | 'stackdriver',
};

export default config;
