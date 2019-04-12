import fs from "fs";

export const readFileSync = (path: string) => {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    return null;
  }
};

export const readSecretSync = (secret: string) => {
  let value = readFileSync(`/run/secrets/${secret}`, "utf8");

  // TODO: remove (temporary hack for docker/util-test.sh taito-cli plugin)
  if (
    !value &&
    secret === "DATABASE_PASSWORD" &&
    process.env.taito_running_tests === "true"
  ) {
    const ciSecret = `/project/tmp/secrets/${process.env.taito_env}/${
      process.env.db_database_name
    }-db-app.password`;
    // tslint:disable-next-line
    console.log(`Reading db secret for ci: ${ciSecret}`);
    // tslint:disable-next-line
    console.log(`Current directory: ${process.cwd()}`);
    value = readFileSync(ciSecret, "utf8");
  }

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
