import { Pool, type PoolClient, type PoolConfig } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import type { DrizzleDb } from '~/db';
import { config, getSecrets, getDatabaseSSL } from '~/src/utils/config';

let poolRefCount = 0;
let globalTestPool: Pool | null = null;
let globalTestDb: { db: DrizzleDb; client: PoolClient } | null = null;

export async function getTestDb(): Promise<DrizzleDb> {
  if (!globalTestDb) {
    const pool = await getTestDbPool();
    const client = await pool.connect();
    globalTestDb = { db: drizzle(client), client };
  }

  return globalTestDb.db;
}

export async function closeTestDb() {
  if (globalTestDb) {
    globalTestDb.client.release();
    globalTestDb = null;
  }

  await releaseTestDbPool();
}

async function getTestDbPool() {
  if (globalTestPool) {
    poolRefCount++;
    return globalTestPool;
  }

  const secrets = await getSecrets();

  const testPoolConfig: PoolConfig = {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    database: config.DATABASE_NAME,
    user: config.DATABASE_USER,
    password: secrets.DATABASE_PASSWORD || '',
    ssl: getDatabaseSSL(config, secrets),

    // Test-optimized pool settings
    max: 5,
    min: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    statement_timeout: 15000,
    application_name: `full-stack-template-test-${process.pid}`,
  };

  globalTestPool = new Pool(testPoolConfig);

  // Add error handling
  globalTestPool.on('error', (err) => {
    console.error('Test database pool error:', err);
  });

  poolRefCount++;
  return globalTestPool;
}

export async function releaseTestDbPool() {
  if (poolRefCount > 0) {
    poolRefCount--;
  }

  if (poolRefCount === 0 && globalTestPool) {
    await globalTestPool.end();
    globalTestPool = null;
  }
}
