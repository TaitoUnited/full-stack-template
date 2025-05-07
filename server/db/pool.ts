import { Pool, PoolConfig } from 'pg';

import { config, getSecrets, getDatabaseSSL } from '~/src/utils/config';

let dbPool: Pool | null = null;

// Initialize Database pool
export async function getDbPool() {
  if (dbPool) {
    return dbPool;
  }

  const secrets = await getSecrets();

  if (!dbPool) {
    const cn: PoolConfig = {
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      database: config.DATABASE_NAME,
      user: config.DATABASE_USER,
      password: secrets.DATABASE_PASSWORD || '',
      max: config.DATABASE_POOL_MAX,
      ssl: getDatabaseSSL(config, secrets),
      statement_timeout: config.DATABASE_STATEMENT_TIMEOUT,
    };

    dbPool = new Pool(cn);
  }

  return dbPool;
}
