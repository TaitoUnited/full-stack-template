import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import { getDbPool } from './pool';

let db: NodePgDatabase<Record<string, never>> | null = null;

export type DrizzleDb = NodePgDatabase<Record<string, never>>;

export async function getDb() {
  if (db) return db;

  const pool = await getDbPool();

  db = drizzle(pool);

  return db;
}
