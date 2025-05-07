import { getDb } from '../index';
import { seed as seedUsers } from './user.seed';
import { seed as seedChat } from './chat.seed';
import { seed as seedOrganisations } from './organisation.seed';

/**
 * This file is used to seed the database with initial data.
 * Split the seed logic into multiple files per domain entity or feature
 * and import them here and pass any dependencies between them.
 */
async function seedDb() {
  console.log('Running database seed...');

  const db = await getDb();

  const users = await seedUsers(db);
  await seedOrganisations(db, { users });
  await seedChat(db, { users });

  console.log('Database seed done!');
}

seedDb();
