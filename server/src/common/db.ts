import pgpInit, { IDatabase } from 'pg-promise';
import config, { getSecrets, getDatabaseSSL } from './config';

let db: IDatabase<Record<string, unknown>> | null = null;

const getDb = async () => {
  if (db) {
    return db;
  }

  const secrets = await getSecrets();
  if (!db) {
    // Initialize DB
    const pgp = pgpInit({
      // Initialization options
    });

    const cn = {
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      database: config.DATABASE_NAME,
      user: config.DATABASE_USER,
      password: secrets.DATABASE_PASSWORD,
      poolSize: config.DATABASE_POOL_MAX,
      ssl: getDatabaseSSL(config, secrets),
    };

    db = pgp(cn);
  }

  return db;
};

export default getDb;
