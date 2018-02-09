// Configs

const required = ['API_BINDADDR', 'API_PORT', 'ENV', 'DEBUG', 'APP_NAME'];

const config = {};

function mapBool(input) {
  if (input === '0' || input === 'false' || input === 'f') return false;
  return !!input;
}

// Basic configs
config.ROOT_PATH = __dirname;
config.ENV = process.env.ENV;
config.DEBUG = mapBool(process.env.DEBUG);
config.APP_NAME = 'server-template-server';
config.APP_VERSION = !process.env.BUILD_IMAGE_TAG
  ? undefined
  : `${process.env.BUILD_VERSION}+${process.env.BUILD_IMAGE_TAG}`;
config.API_PORT = process.env.API_PORT;
config.API_BINDADDR = process.env.API_BINDADDR;

// Secrets
config.JWT_SECRET = process.env.JWT_SECRET;
// NOTE: Use environment variable passwords only for a simple
// 'shared username and password' use case. Passwords of real users should
// always be hashed, salted and stored elsewhere
config.passwords = {
  admin: process.env.ADMIN_PASSWORD,
  user: process.env.USER_PASSWORD
};

// Cache
config.CACHE_HOST = 'cache'; // process.env.CACHE_HOST;
config.CACHE_PORT = process.env.CACHE_PORT;

// Database
config.DATABASE_HOST = process.env.DATABASE_HOST;
config.DATABASE_PORT = process.env.DATABASE_PORT;
config.DATABASE_ID = process.env.DATABASE_ID;
config.DATABASE_USER = process.env.DATABASE_USER;
config.DATABASE_SECRET = process.env.DATABASE_SECRET;
config.DATABASE_POOL_MAX = process.env.DATABASE_POOL_MAX
  ? parseInt(process.env.DATABASE_POOL_MAX, 10)
  : 10;

// Storage
config.S3_URL = process.env.S3_URL;
config.S3_REGION = process.env.S3_REGION;
config.S3_BUCKET = process.env.S3_BUCKET;
config.S3_KEY_ID = process.env.S3_KEY_ID;
config.S3_KEY_SECRET = process.env.S3_KEY_SECRET;

// Check requirements
required.forEach(req => {
  if (config[req] === undefined) {
    throw new Error(
      `FATAL: Configuration problem: param "${req}" undefined. ` +
        'Maybe missing ENV var?'
    );
  }
});

export default config;
