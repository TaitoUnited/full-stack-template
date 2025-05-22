import { eq } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { organisationTable, userOrganisationTable } from './organisation.db';

async function getOrganisation(db: DrizzleDb, id: string) {
  return db
    .select({ id: organisationTable.id, name: organisationTable.name })
    .from(organisationTable)
    .where(eq(organisationTable.id, id))
    .then((rows) => rows[0]);
}

async function getUserOrganisations(db: DrizzleDb, userId: string) {
  return db
    .select()
    .from(organisationTable)
    .innerJoin(
      userOrganisationTable,
      eq(organisationTable.id, userOrganisationTable.organisationId)
    )
    .where(eq(userOrganisationTable.userId, userId));
}

async function getUserOrganisationsWithRoles(db: DrizzleDb, userId: string) {
  return db
    .select({
      organisationId: userOrganisationTable.organisationId,
      role: userOrganisationTable.role,
    })
    .from(userOrganisationTable)
    .where(eq(userOrganisationTable.userId, userId));
}

export const organisationDao = {
  getOrganisation,
  getUserOrganisations,
  getUserOrganisationsWithRoles,
};
