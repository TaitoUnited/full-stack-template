import { drizzle } from 'drizzle-orm/node-postgres';
import type { TestProject } from 'vitest/node';

import type { DrizzleDb } from '~/db';
import {
  organisationTable,
  userOrganisationTable,
} from '~/src/organisation/organisation.db';
import { userTable } from '~/src/user/user.db';
import { getAuth } from '~/src/utils/authentication';
import { type Role, ROLES } from '~/src/utils/authorisation';
import { hashPassword } from '~/src/utils/password';

import { closeTestDbPool, getTestDbPool } from './setup-test-db';
import type { TestData, TestUser } from './setup-types';

/**
 * Sets up shared data for database-backed and API tests. The test runner drops
 * the whole disposable database after Vitest exits, so this setup never reads
 * or cleans up data in an application database.
 */
export default async function setup({ provide }: TestProject) {
  console.log('Setting up shared test data...');

  const pool = await getTestDbPool();
  const db = drizzle(pool);

  try {
    const organisation = await createTestOrganisation(
      db,
      'Server test organisation'
    );

    const [admin, manager, viewer] = await Promise.all([
      setupUser(db, { role: ROLES.ADMIN, organisationId: organisation.id }),
      setupUser(db, { role: ROLES.MANAGER, organisationId: organisation.id }),
      setupUser(db, { role: ROLES.VIEWER, organisationId: organisation.id }),
    ]);

    const testData: TestData = {
      organisation,
      users: { admin, manager, viewer },
    };

    provide('testData', testData);

    // The runner drops the database. Close only this process's pool first.
    return closeTestDbPool;
  } catch (error) {
    console.error('Failed to set up shared test data:', error);
    await closeTestDbPool();
    throw error;
  }
}

async function setupUser(
  db: DrizzleDb,
  data: { organisationId: string; role: Role }
): Promise<TestUser> {
  const password = 'server-test-password';
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(userTable)
    .values({
      name: `Server test ${data.role}`,
      email: `${data.role}@server-test-data.com`,
      passwordHash,
    })
    .returning({ id: userTable.id, email: userTable.email });

  if (!user) {
    throw new Error(`Failed to create server test ${data.role} user`);
  }

  await db.insert(userOrganisationTable).values({
    userId: user.id,
    organisationId: data.organisationId,
    role: data.role,
  });

  const session = await getAuth(db).createSession(user.id, {
    refreshToken: null,
    refreshTokenExpiresAt: null,
  });

  return { ...user, sessionId: session.id, role: data.role };
}

async function createTestOrganisation(db: DrizzleDb, name: string) {
  const [organisation] = await db
    .insert(organisationTable)
    .values({ name })
    .returning({ id: organisationTable.id });

  if (!organisation) {
    throw new Error('Failed to create server test organisation');
  }

  return organisation;
}
