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
};

const db: IDatabase<{}> = pgp(cn);

export default db;
