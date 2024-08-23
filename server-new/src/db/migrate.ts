import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { getDb } from '.';

// This file is used to execute Drizzle DB migrations
async function main() {
  console.log('Running Drizzle database migrations...');

  const db = await getDb();

  console.log('Drizzle initialized');

  await migrate(db, { migrationsFolder: 'drizzle' });

  console.log('Migrations done.');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
