import pgpInit, { IDatabase } from 'pg-promise';
import config, { getSecrets, getDatabaseSSL } from './config';

let db: IDatabase<Record<string, unknown>> | null = null;

const camelizeColumns = (data: any) => {
  const template = data[0];
  for (let prop in template) {
    const camel = pgpInit.utils.camelize(prop);
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

const getDb = async () => {
  if (db) {
    return db;
  }

  const secrets = await getSecrets();
  if (!db) {
    // Initialize DB
    const pgp = pgpInit({
      // Initialization options
      receive: (data) => {
        camelizeColumns(data);
      },
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
