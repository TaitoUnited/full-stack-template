import { promises as fsPromises } from 'fs';
import { isIP } from 'net';
import aws from 'aws-sdk';

// prettier-ignore
const secretManagerClient = new aws.SecretsManager({ // aws
  region: process.env.SECRET_REGION, // aws
}); // aws

// prettier-ignore
export const readAwsSecret = async (secretId: string) => { // aws
  const data = await secretManagerClient // aws
    .getSecretValue({ SecretId: secretId }) // aws
    .promise(); // aws
  return data ? data.SecretString : null; // aws
}; // aws

export const readFile = async (path: string) => {
  const buf = await fsPromises.readFile(path);
  return buf.toString();
};

// prettier-ignore
export const readSecret = async (secret: string, isFileSecret = false) => {
  let value = null;
  try {
    if (process.env[secret]) {
      value = process.env[secret];
    } else if (process.env[`${secret}_SECRETID`]) { // aws
      value = await readAwsSecret(process.env[`${secret}_SECRETID`] as string); // aws
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
  RUN_AS_FUNCTION: process.env.RUN_AS_FUNCTION === 'true',

  // Basic
  ROOT_PATH: __dirname,
  APP_NAME: 'full-stack-template-server',
  DEBUG: Boolean(process.env.COMMON_DEBUG),
  APP_VERSION: !process.env.BUILD_IMAGE_TAG
    ? `${process.env.BUILD_VERSION}+local`
    : `${process.env.BUILD_VERSION}+${process.env.BUILD_IMAGE_TAG}`,
  API_PORT: process.env.API_PORT
    ? parseInt(process.env.API_PORT as string, 10)
    : 4000,
  API_BINDADDR: process.env.API_BINDADDR || '127.0.0.1',
  BASE_PATH: process.env.BASE_PATH || '/api',

  // AUTH
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
  AUTH0_CLIENT_CLIENT_ID: process.env.AUTH0_CLIENT_CLIENT_ID,
  AUTH0_SERVER_CLIENT_ID: process.env.AUTH0_SERVER_CLIENT_ID,

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

/**
 * Secrets defined here, `true` meaning "fetch a secret with this key" and
 * "false" meaning, well, don't.
 */
const secretsDefinition = {
  DATABASE_PASSWORD: true,
  DATABASE_SSL_CA: useClientCert || useServerCert,
  DATABASE_SSL_CERT: useClientCert,
  DATABASE_SSL_KEY: useClientCert,
  REDIS_PASSWORD: true,
  BUCKET_KEY_SECRET: true,
  AUTH0_SERVER_CLIENT_SECRET: true,
};

let secrets: Record<
  keyof typeof secretsDefinition,
  string | null | undefined
> | null = null;

export const getSecrets = async (): Promise<NonNullable<typeof secrets>> => {
  if (secrets) {
    return secrets;
  }

  // Secrets
  const s = await Promise.all(
    Object.entries(secretsDefinition).map(async ([key, fetch]) => {
      if (!fetch) {
        return [key, undefined] as const;
      }
      return [key, await readSecret(key)] as const;
    })
  );

  if (!secrets) {
    secrets = s.reduce(
      (obj, [key, val]) => ({
        ...obj,
        [key]: val,
      }),
      {} as Record<string, any>
    );
  }
  return secrets;
};

export const getDatabaseSSL = (config: any, secrets: any) => {
  const ssl =
    config.DATABASE_SSL_ENABLED && config.DATABASE_SSL_CLIENT_CERT_ENABLED
      ? {
          ca: secrets.DATABASE_SSL_CA,
          cert: secrets.DATABASE_SSL_CERT,
          key: secrets.DATABASE_SSL_KEY,
        }
      : config.DATABASE_SSL_ENABLED && config.DATABASE_SSL_SERVER_CERT_ENABLED
      ? {
          ca: secrets.DATABASE_SSL_CA,
        }
      : config.DATABASE_SSL_ENABLED
      ? { rejectUnauthorized: false } // TODO: remove once works
      : false;

  // Skip hostname check (allow IP address) if SSL is enabled but HOST is IP
  return ssl !== false &&
    (isIP(config.DATABASE_HOST) || config.DATABASE_HOST.indexOf('proxy') !== -1)
    ? {
        ...ssl,
        checkServerIdentity: () => undefined,
      }
    : ssl;
};

export default config;
