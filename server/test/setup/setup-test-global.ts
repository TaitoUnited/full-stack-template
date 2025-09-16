import { eq } from 'drizzle-orm';
import type { GlobalSetupContext } from 'vitest/node';

import {
  organisationTable,
  userOrganisationTable,
} from '~/src/organisation/organisation.db';
import { userTable } from '~/src/user/user.db';
import { sessionTable } from '~/src/session/session.db';
import { DrizzleDb } from '~/db';
import { hashPassword } from '~/src/utils/password';
import { ROLES, Role } from '~/src/utils/authorisation';
import { graphql, client } from '~/test/graphql-test-client';
import { closeTestDb, getTestDb } from './setup-test-db';
import { TestData, TestUser } from './setup-types';

/**
 * Setup shared test data for API integration tests.
 * This should only include data that is required for any test to run,
 * such as organisations, logged in users, etc.
 */
export default async function setup({ provide }: GlobalSetupContext) {
  console.log('Setting up test data for API integration tests...');
  try {
    const db = await getTestDb();

    const organisation = await createOrFindOrganisation(
      db,
      'API integration test organisation'
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

    // `provide` makes `testData` available with `inject()`
    provide('testData', testData);

    // Delete test data in the cleanup phase (after all tests have run)
    return async () => {
      console.log('Deleting global test data for API integration tests...');

      try {
        for (const user of Object.values(testData.users)) {
          await cleanupUser(db, user);
        }
        await db
          .delete(organisationTable)
          .where(eq(organisationTable.id, organisation.id));
      } catch (error) {
        console.error('Error during test data cleanup:', error);
      } finally {
        await closeTestDb();
      }
    };
  } catch (error) {
    console.error('Failed to setup test data:', error);
    await closeTestDb();
    throw error; // Re-throw to fail the setup
  }
}

// Helpers

const testPassword = 'password';

async function setupUser(
  db: DrizzleDb,
  data: { role: Role; organisationId: string }
): Promise<TestUser> {
  // Create user
  const user = await createOrFindUser(db, {
    name: `API integration test ${data.role}`,
    email: `${data.role}@test-data.com`,
  });

  // Add user to organisation
  await db
    .insert(userOrganisationTable)
    .values({
      userId: user.id,
      organisationId: data.organisationId,
      role: data.role,
    })
    .onConflictDoUpdate({
      target: [
        userOrganisationTable.userId,
        userOrganisationTable.organisationId,
      ],
      set: { role: data.role },
    });

  // Login user and return session ID
  const loginResult = await client.request(
    graphql(`
      mutation Login($email: String!, $password: String!) {
        loginToken(email: $email, password: $password) {
          sessionId
        }
      }
    `),
    { email: user.email, password: testPassword }
  );

  return {
    id: user.id,
    email: user.email,
    password: testPassword,
    sessionId: loginResult.loginToken.sessionId,
    role: data.role,
  };
}

async function cleanupUser(db: DrizzleDb, user: TestUser) {
  await client.request(
    graphql(`
      mutation Logout {
        logoutToken {
          status
        }
      }
    `),
    { email: user.email, password: testPassword },
    { Authorization: `Bearer ${user.sessionId}` }
  );
  // Logout mutation only expires the session, so we need to delete it manually
  await db.delete(sessionTable).where(eq(sessionTable.userId, user.id));
  await db.delete(userTable).where(eq(userTable.id, user.id));
}

async function createOrFindOrganisation(db: DrizzleDb, name: string) {
  const [organisation] = await db
    .select({ id: organisationTable.id })
    .from(organisationTable)
    .where(eq(organisationTable.name, name));

  if (organisation) return organisation;

  return db
    .insert(organisationTable)
    .values({ name })
    .onConflictDoNothing()
    .returning({ id: organisationTable.id })
    .then((rows) => rows[0]!);
}

async function createOrFindUser(
  db: DrizzleDb,
  data: { email: string; name: string }
) {
  const [user] = await db
    .select({ id: userTable.id, email: userTable.email })
    .from(userTable)
    .where(eq(userTable.email, data.email));

  if (user) return user;

  const passwordHash = await hashPassword(testPassword);
  const values = { ...data, passwordHash };

  return db
    .insert(userTable)
    .values(values)
    .onConflictDoUpdate({ target: userTable.email, set: values })
    .returning({ id: userTable.id, email: userTable.email })
    .then((rows) => rows[0]!);
}
