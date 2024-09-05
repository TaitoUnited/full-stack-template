import { type DrizzleDb } from '../index';
import { type UserSeed } from './user.seed';
import { ROLES } from '~/domain/authorisation/roles';
import {
  organisationTable,
  userOrganisationTable,
} from '~/domain/organisation/organisation.db';

export type Organisation = {
  id: string;
  name: string;
};

export type OrganisationSeed = {
  organisation1: Organisation;
  organisation2: Organisation;
};

export async function seed(
  db: DrizzleDb,
  data: { users: UserSeed }
): Promise<OrganisationSeed> {
  console.log('Inserting organisations...');

  const { users } = data;

  /**
   * NOTE: we intentionally don't add the `user4` to any organisation
   * so that we can test the case where a user is not part of any organisation.
   * For example in such case the user should not be able to login to the app.
   */

  const organisation1 = await createOrganisation(db, 'Taito United');

  await addUserToOrganisation(db, {
    organisationId: organisation1.id,
    userId: users.user1.id,
    role: ROLES.ADMIN,
  });
  await addUserToOrganisation(db, {
    organisationId: organisation1.id,
    userId: users.user2.id,
    role: ROLES.MANAGER,
  });
  await addUserToOrganisation(db, {
    organisationId: organisation1.id,
    userId: users.user3.id,
    role: ROLES.VIEWER,
  });

  const organisation2 = await createOrganisation(db, 'Taito Corp');

  // Change the roles to test different scenarios
  await addUserToOrganisation(db, {
    organisationId: organisation2.id,
    userId: users.user1.id,
    role: ROLES.VIEWER,
  });
  await addUserToOrganisation(db, {
    organisationId: organisation2.id,
    userId: users.user2.id,
    role: ROLES.ADMIN,
  });
  await addUserToOrganisation(db, {
    organisationId: organisation2.id,
    userId: users.user3.id,
    role: ROLES.MANAGER,
  });

  return { organisation1, organisation2 };
}

// Helpers

async function createOrganisation(
  db: DrizzleDb,
  name: string
): Promise<Organisation> {
  return db
    .insert(organisationTable)
    .values({ name })
    .onConflictDoNothing()
    .returning({ id: organisationTable.id, name: organisationTable.name })
    .then((rows) => rows[0]!);
}

async function addUserToOrganisation(
  db: DrizzleDb,
  options: { userId: string; organisationId: string; role: string }
) {
  await db
    .insert(userOrganisationTable)
    .values({
      userId: options.userId,
      organisationId: options.organisationId,
      role: options.role,
    })
    .onConflictDoUpdate({
      target: [
        userOrganisationTable.userId,
        userOrganisationTable.organisationId,
      ],
      set: { role: options.role },
    });
}
