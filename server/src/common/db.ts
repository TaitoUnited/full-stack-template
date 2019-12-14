import pgpInit, { IDatabase } from 'pg-promise';
import config from './config';

const pgp = pgpInit({
  // Initialization options
});

const cn = {
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  database: config.DATABASE_NAME,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  poolSize: config.DATABASE_POOL_MAX,
  ssl:
    config.DATABASE_SSL_ENABLED && config.DATABASE_SSL_CLIENT_CERT_ENABLED
      ? {
          ca: config.DATABASE_SSL_CA,
          cert: config.DATABASE_SSL_CERT,
          key: config.DATABASE_SSL_KEY,
        }
      : config.DATABASE_SSL_ENABLED,
};

const db: IDatabase<{}> = pgp(cn);

export default db;
