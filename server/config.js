// Configs

const required = [
  'API_BINDADDR',
  'API_PORT',
  'ENV',
  'DEBUG',
  'APP_NAME',
];

const config = {};

function mapBool(input) {
  if (input === '0' || input === 'false' || input === 'f') return false;
  return !!input;
}

config.ROOT_PATH = __dirname;

config.ENV = process.env.ENV;
config.DEBUG = mapBool(process.env.DEBUG);
config.APP_NAME = 'server-template-server';
config.APP_VERSION = !process.env.BUILD_IMAGE_TAG ? undefined :
  `${process.env.BUILD_VERSION}+${process.env.BUILD_IMAGE_TAG}`;
config.API_PORT = process.env.API_PORT;
config.API_BINDADDR = process.env.API_BINDADDR;

// Bucket
config.BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY;
config.BUCKET_SECRET_KEY = process.env.BUCKET_SECRET_KEY;
config.BUCKET_ID = process.env.BUCKET_ID;
config.BUCKET_REGION = process.env.BUCKET_REGION;
config.BUCKET_URL =
  '${process.env.BUCKET_PROTOCOL}://${process.env.BUCKET_HOST}:${process.env.BUCKET_PORT}'; // eslint-disable-line

config.DATABASE_HOST = process.env.DATABASE_HOST;
config.DATABASE_PORT = process.env.DATABASE_PORT;
config.DATABASE_ID = process.env.DATABASE_ID;
config.DATABASE_USER = process.env.DATABASE_USER;
config.DATABASE_SECRET = process.env.DATABASE_SECRET;
config.DATABASE_POOL_MAX = process.env.DATABASE_POOL_MAX
  ? parseInt(process.env.DATABASE_POOL_MAX, 10) : 10;

config.CACHE_HOST = 'cache'; // process.env.CACHE_HOST;
config.CACHE_PORT = process.env.CACHE_PORT;

// Check requirements
for (const req of required) {
  if (config[req] === undefined) {
    throw new Error(
      `FATAL: Configuration problem: param "${req}" undefined. ` +
      `Maybe missing ENV var?`
    );
  }
}

export default config;
