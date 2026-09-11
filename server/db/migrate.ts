import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { getDb } from '.';
import { closeDbPool } from './pool';

/**
 * This file is used to execute Drizzle DB migrations
 * https://orm.drizzle.team/docs/migrations
 */
async function migrateDb() {
  console.log('Running Drizzle database migrations...');

  try {
    const db = await getDb();

    console.log('Drizzle initialized');

    await migrate(db, { migrationsFolder: 'db/migrations' });

    console.log('Migrations done.');
  } finally {
    await closeDbPool();
  }
}

void migrateDb();
