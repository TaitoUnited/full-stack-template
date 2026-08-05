import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

import { getDbPool } from './pool';

let db: NodePgDatabase | null = null;

export type DrizzleDb = NodePgDatabase;

export async function getDb() {
  if (db) return db;

  const pool = await getDbPool();

  db = drizzle(pool);

  return db;
}
