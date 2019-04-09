import fs from "fs";

export const readSecretSync = (secret: string) => {
  let value;
  try {
    value = fs.readFileSync(`/run/secrets/${secret}`, "utf8");
  } catch (err) {
    // tslint:disable-next-line
    console.warn(`WARNING: Failed to read secret ${secret}`);
  }
  return value;
};

const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV, // development / production
  COMMON_ENV: process.env.COMMON_ENV, // dev / test / stag / prod

  // Basic
  ROOT_PATH: __dirname,
  APP_NAME: "server-template-server",
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
  DATABASE_PASSWORD: readSecretSync("DATABASE_PASSWORD"),
  DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX
    ? parseInt(process.env.DATABASE_POOL_MAX, 10)
    : 10,

  // Logging
  COMMON_LOG_LEVEL: process.env.COMMON_LOG_LEVEL,
  COMMON_LOG_FORMAT: process.env.COMMON_LOG_FORMAT
};

export default config;
