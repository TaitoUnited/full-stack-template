import pgpInit, { IDatabase } from 'pg-promise';
import config, { getSecrets } from './config';

const db: IDatabase<Record<string, unknown>> | null = null;

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
      ssl:
        config.DATABASE_SSL_ENABLED && config.DATABASE_SSL_CLIENT_CERT_ENABLED
          ? {
              ca: secrets.DATABASE_SSL_CA,
              cert: secrets.DATABASE_SSL_CERT,
              key: secrets.DATABASE_SSL_KEY,
            }
          : config.DATABASE_SSL_ENABLED &&
            config.DATABASE_SSL_SERVER_CERT_ENABLED
          ? {
              ca: secrets.DATABASE_SSL_CA,
            }
          : config.DATABASE_SSL_ENABLED
          ? { rejectUnauthorized: false }
          : false,
    };

    db = pgp(cn);
  }

  return db;
};

export default getDb;
