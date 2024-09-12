import { promises as fsPromises } from 'fs';
import { isIP } from 'net';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const secretManagerClient: SecretsManagerClient = new SecretsManagerClient({
  region: process.env.SECRET_REGION,
});

export async function readAwsSecret(secretId: string, isBase64Encoded = false) {
  try {
    const data = await secretManagerClient.send(
      new GetSecretValueCommand({ SecretId: secretId })
    );

    return data && data.SecretString
      ? isBase64Encoded
        ? Buffer.from(data.SecretString, 'base64').toString('ascii')
        : data.SecretString
      : null;
  } catch (_) {}

  return null;
}

export async function readFile(path?: string | null) {
  try {
    return path ? (await fsPromises.readFile(path)).toString() : null;
  } catch (_) {}

  return null;
}

export async function readMandatorySecret(
  secret: string,
  isFileSecret = false,
  altFilePath?: string | null
) {
  const value = await readSecret(secret, isFileSecret, altFilePath);

  // QUICK FIX: all secrets not set when running drizzle migrations
  // if (!value) {
  //   throw Error(`Secret ${secret} value not set.`);
  // }

  return value;
}

export async function readSecret(
  secret: string,
  isFileSecret = false,
  altFilePath?: string | null
) {
  const value =
    process.env[secret] ||
    (process.env[`${secret}_SECRETID`] &&
      (await readAwsSecret(
        process.env[`${secret}_SECRETID`] as string,
        isFileSecret
      ))) ||
    (await readFile(`/run/secrets/${secret}`)) ||
    (await readFile(altFilePath));

  if (!value) {
    console.warn(`WARNING: Failed to read secret ${secret}`);
  }

  return value;
}

const useClientCert = process.env.DATABASE_SSL_CLIENT_CERT_ENABLED === 'true';
const useServerCert = process.env.DATABASE_SSL_SERVER_CERT_ENABLED === 'true';

export const config = {
  // Environment
  COMMON_PROJECT: process.env.COMMON_PROJECT,
  COMMON_COMPANY: process.env.COMMON_COMPANY,
  COMMON_FAMILY: process.env.COMMON_FAMILY,
  COMMON_APPLICATION: process.env.COMMON_APPLICATION,
  COMMON_SUFFIX: process.env.COMMON_SUFFIX,
  COMMON_DOMAIN: process.env.COMMON_DOMAIN,
  COMMON_IMAGE_TAG: process.env.COMMON_IMAGE_TAG,
  COMMON_ENV: process.env.COMMON_ENV || 'local', // local | dev | test | stag | prod
  COMMON_PUBLIC_PORT: process.env.COMMON_PUBLIC_PORT
    ? parseInt(process.env.COMMON_PUBLIC_PORT, 10)
    : null,
  NODE_ENV: process.env.NODE_ENV, // development | production
  RUN_AS_FUNCTION: process.env.RUN_AS_FUNCTION === 'true',

  // Basic
  ROOT_PATH: __dirname,
  APP_NAME: 'full-stack-template-server',
  DEBUG: Boolean(process.env.COMMON_DEBUG),
  APP_VERSION: !process.env.BUILD_IMAGE_TAG
    ? `${process.env.BUILD_VERSION}+local`
    : `${process.env.BUILD_VERSION}+${process.env.BUILD_IMAGE_TAG}`,
  API_PORT: process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 4000,
  API_BINDADDR: process.env.API_BINDADDR || '127.0.0.1',
  BASE_PATH: process.env.BASE_PATH || '/api',
  API_DOCS_ENABLED: process.env.API_DOCS_ENABLED?.toString() === 'true',
  API_PLAYGROUND_ENABLED:
    process.env.API_PLAYGROUND_ENABLED?.toString() === 'true',

  // Cache
  CACHE_HOST: process.env.CACHE_HOST as string,
  CACHE_PORT: parseInt(process.env.CACHE_PORT as string, 10),

  // Sentry
  SENTRY_DSN: process.env.SENTRY_DSN,

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
  DATABASE_STATEMENT_TIMEOUT: process.env.DATABASE_STATEMENT_TIMEOUT
    ? parseInt(process.env.DATABASE_STATEMENT_TIMEOUT, 10)
    : 1 * 60 * 1000, // 1 min by default
  DATABASE_SSL_ENABLED: process.env.DATABASE_SSL_ENABLED !== 'false',
  DATABASE_SSL_CLIENT_CERT_ENABLED: useClientCert,
  DATABASE_SSL_SERVER_CERT_ENABLED: useServerCert,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379,

  // Storage
  BUCKET_ENDPOINT: process.env.BUCKET_ENDPOINT || undefined,
  BUCKET_REGION: process.env.BUCKET_REGION,
  BUCKET_BUCKET: process.env.BUCKET_BUCKET as string,
  BUCKET_GCP_PROJECT_ID: process.env.BUCKET_GCP_PROJECT_ID as string,
  BUCKET_BROWSE_URL: process.env.BUCKET_BROWSE_URL as string,
  BUCKET_DOWNLOAD_URL: process.env.BUCKET_DOWNLOAD_URL as string,
  BUCKET_KEY_ID: process.env.BUCKET_KEY_ID,
  BUCKET_FORCE_PATH_STYLE: Boolean(process.env.BUCKET_FORCE_PATH_STYLE),

  // Locale
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'fi',

  // Logging
  COMMON_LOG_LEVEL: process.env.COMMON_LOG_LEVEL,
  COMMON_LOG_FORMAT: process.env.COMMON_LOG_FORMAT as 'text' | 'stackdriver',

  // Session
  SESSION_COOKIE: 'session',
};

let secrets: any = null;

export async function getSecrets() {
  if (secrets) {
    return secrets;
  }

  // Secrets
  const s = {
    SERVICE_ACCOUNT_KEY: await readSecret(
      'SERVICE_ACCOUNT_KEY',
      true,
      '/serviceaccount/key'
    ),
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
    SESSION_SECRET: await readMandatorySecret('SESSION_SECRET'),
    EXAMPLE_SECRET: await readMandatorySecret('EXAMPLE_SECRET'),
  };

  if (!secrets) {
    secrets = s;
  }

  return secrets;
}

export function getDatabaseSSL(config: any, secrets: any) {
  const ssl =
    config.DATABASE_SSL_ENABLED && config.DATABASE_SSL_CLIENT_CERT_ENABLED
      ? {
          ca: secrets.DATABASE_SSL_CA,
          cert: secrets.DATABASE_SSL_CERT,
          key: secrets.DATABASE_SSL_KEY,
        }
      : config.DATABASE_SSL_ENABLED && config.DATABASE_SSL_SERVER_CERT_ENABLED
        ? { ca: secrets.DATABASE_SSL_CA }
        : config.DATABASE_SSL_ENABLED
          ? { rejectUnauthorized: false } // TODO: remove once AWSCA check works
          : false;

  // Skip hostname check if SSL is enabled but HOST is IP or proxy
  return ssl !== false &&
    (isIP(config.DATABASE_HOST) ||
      config.DATABASE_HOST?.indexOf('proxy') !== -1)
    ? { ...ssl, checkServerIdentity: () => undefined }
    : ssl;
}
