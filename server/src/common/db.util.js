import pg from 'pg-promise';
import config from '../common/common.config';

const pgp = pg({
  // Initialization options
});

const cn = {
  host: config.DATABASE_HOST,
  port: parseInt(config.DATABASE_PORT, 10),
  database: config.DATABASE_ID,
  user: config.DATABASE_USER,
  password: config.DATABASE_SECRET,
  poolSize: config.DATABASE_POOL_MAX,
};

const db = pgp(cn);

export default db;
