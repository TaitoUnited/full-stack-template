import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { getDb } from '.';

/**
 * This file is used to execute Drizzle DB migrations
 * https://orm.drizzle.team/docs/migrations
 */
async function migrateDb() {
  console.log('Running Drizzle database migrations...');

  const db = await getDb();

  console.log('Drizzle initialized');

  await migrate(db, { migrationsFolder: 'src/db/migrations' });

  console.log('Migrations done.');
}

migrateDb();
