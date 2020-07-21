import { promises as fsPromises } from 'fs';
import aws from 'aws-sdk';

const awsParamStore = new aws.SSM();

export const readFile = async (path: string) => {
  const buf = await fsPromises.readFile(path);
  return buf.toString();
};

// prettier-ignore
export const readParameter = async (paramName: string) => { // aws
  const secretPath = `${process.env.SECRET_NAME_PATH}/${paramName}`; // aws
  const result = await awsParamStore // aws
    .getParameter({ Name: secretPath, WithDecryption: true }) // aws
    .promise(); // aws
  return result && result.Parameter && result.Parameter.Value; // aws
}; // aws

// prettier-ignore
export const readSecret = async (secret: string, isFileSecret = false) => {
  let value = null;
  try {
    if (process.env[secret]) {
      value = process.env[secret];
    } else if (process.env[`${secret}_PARAM`]) { // aws
      value = await readParameter(process.env[`${secret}_PARAM`] as string); // aws
      if (value && isFileSecret) { // aws
        value = Buffer.from(value, 'base64').toString('ascii'); // aws
      } // aws
    } else {
      value = await readFile(`/run/secrets/${secret}`);
    }
  } catch (err) {
    console.log(err);
  }
  // tslint:disable-next-line
  if (!value) console.warn(`WARNING: Failed to read secret ${secret}`);
  return value;
};

const useClientCert = process.env.DATABASE_SSL_CLIENT_CERT_ENABLED === 'true';
const useServerCert = process.env.DATABASE_SSL_SERVER_CERT_ENABLED === 'true';

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
  BASE_PATH: process.env.BASE_PATH || '/api',

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
  DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX
    ? parseInt(process.env.DATABASE_POOL_MAX, 10)
    : 10,
  DATABASE_SSL_ENABLED: process.env.DATABASE_SSL_ENABLED !== 'false',
  DATABASE_SSL_CLIENT_CERT_ENABLED: useClientCert,
  DATABASE_SSL_SERVER_CERT_ENABLED: useServerCert,
  // Redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379,
  // Storage
  BUCKET_URL: process.env.BUCKET_URL || undefined,
  BUCKET_REGION: process.env.BUCKET_REGION,
  BUCKET_BUCKET: process.env.BUCKET_BUCKET as string,
  BUCKET_BROWSE_URL: process.env.BUCKET_BROWSE_URL as string,
  BUCKET_DOWNLOAD_URL: process.env.BUCKET_DOWNLOAD_URL as string,
  BUCKET_KEY_ID: process.env.BUCKET_KEY_ID,
  BUCKET_FORCE_PATH_STYLE: Boolean(process.env.BUCKET_FORCE_PATH_STYLE),

  // Logging
  COMMON_LOG_LEVEL: process.env.COMMON_LOG_LEVEL,
  COMMON_LOG_FORMAT: process.env.COMMON_LOG_FORMAT as 'text' | 'stackdriver',
};

let secrets: any = null;

export const getSecrets = async () => {
  if (secrets) {
    return secrets;
  }

  // Secrets
  const s = {
    DATABASE_PASSWORD: await readSecret('DATABASE_PASSWORD'),
    DATABASE_SSL_CA:
      useClientCert || useServerCert
        ? await readSecret('DATABASE_SSL_CA', true)
        : undefined,
    DATABASE_SSL_CERT: useClientCert
      ? await readSecret('DATABASE_SSL_CERT', true)
      : undefined,
    DATABASE_SSL_KEY: useClientCert
      ? await readSecret('DATABASE_SSL_KEY', true)
      : undefined,
    REDIS_PASSWORD: await readSecret('REDIS_PASSWORD'),
    BUCKET_KEY_SECRET: await readSecret('BUCKET_KEY_SECRET'),
  };

  if (!secrets) {
    secrets = s;
  }
  return secrets;
};

export default config;
