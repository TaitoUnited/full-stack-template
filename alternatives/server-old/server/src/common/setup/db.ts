import pgpInit, { IDatabase } from 'pg-promise';
import config, { getSecrets, getDatabaseSSL } from './config';

let db: IDatabase<Record<string, unknown>> | null = null;

const camelizeColumns = (data: any) => {
  const template = data[0];
  for (const prop in template) {
    const camel = pgpInit.utils.camelize(prop);
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

// Initialize DB
export const pgp = pgpInit({
  // Initialization options
  capSQL: true,
  receive: (data) => {
    camelizeColumns(data);
  },
});

const getDb = async () => {
  if (db) {
    return db;
  }

  const secrets = await getSecrets();
  if (!db) {
    const cn = {
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      database: config.DATABASE_NAME,
      user: config.DATABASE_USER,
      password: secrets.DATABASE_PASSWORD,
      poolSize: config.DATABASE_POOL_MAX,
      ssl: getDatabaseSSL(config, secrets),
      statement_timeout: config.DATABASE_STATEMENT_TIMEOUT,
    };

    db = pgp(cn);
  }

  return db;
};

export default getDb;
