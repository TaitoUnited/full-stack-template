import { beforeAll } from 'vitest';
import { eq } from 'drizzle-orm';

import {
  organisationTable,
  userOrganisationTable,
} from '~/domain/organisation/organisation.db';
import { userTable } from '~/domain/user/user.db';
import { sessionTable } from '~/domain/session/session.db';
import { DrizzleDb, getDb } from '~/db';
import { hashPassword } from '~/utils/password';
import { ROLES, Role } from '~/utils/authorisation';
import { graphql, client } from '~/test/graphql-test-client';

/**
 * Setup shared test data for API integration tests.
 * This should only include data that is required for any test to run,
 * such as organisations, logged in users, etc.
 */
beforeAll(async () => {
  if (globalThis.testData) return; // skip if already setup

  const db = await getDb();

  const organisation = await createOrFindOrganisation(
    db,
    'API integration test organisation'
  );

  const [admin, manager, viewer] = await Promise.all([
    setupUser(db, { role: ROLES.ADMIN, organisationId: organisation.id }),
    setupUser(db, { role: ROLES.MANAGER, organisationId: organisation.id }),
    setupUser(db, { role: ROLES.VIEWER, organisationId: organisation.id }),
  ]);

  globalThis.testData = {
    organisation,
    users: { admin, manager, viewer },
  };

  // Delete test data in the cleanup phase (after all tests have run)
  return async () => {
    if (globalThis.testData) {
      const { organisation, users } = globalThis.testData;

      for (const user of Object.values(users)) {
        await cleanupUser(db, user);
      }
      await db
        .delete(organisationTable)
        .where(eq(organisationTable.id, organisation.id));
    }
  };
});

// Types

type TestUser = {
  id: string;
  email: string;
  password: string;
  sessionId: string;
};

type TestData = {
  organisation: {
    id: string;
  };
  users: {
    admin: TestUser;
    manager: TestUser;
    viewer: TestUser;
  };
};

/* eslint-disable no-var */
declare global {
  var testData: TestData;
}

// Helpers

const testPassword = 'wWAoQPsZRwa28XsqNrEuUa4iJf';

async function setupUser(
  db: DrizzleDb,
  data: { role: Role; organisationId: string }
): Promise<TestUser> {
  // Create user
  const user = await createOrFindUser(db, {
    name: `API integration test ${data.role}`,
    email: `${data.role}@test.com`,
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
