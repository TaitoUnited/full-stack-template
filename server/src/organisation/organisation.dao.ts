import { and, eq } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { organisationTable, userOrganisationTable } from './organisation.db';

function getOrganisation(
  db: DrizzleDb,
  options: { id: string; userId: string }
) {
  return db
    .select({ id: organisationTable.id, name: organisationTable.name })
    .from(organisationTable)
    .innerJoin(
      userOrganisationTable,
      eq(organisationTable.id, userOrganisationTable.organisationId)
    )
    .where(
      and(
        eq(organisationTable.id, options.id),
        eq(userOrganisationTable.userId, options.userId)
      )
    )
    .then((rows) => rows[0]);
}

function getUserOrganisations(db: DrizzleDb, userId: string) {
  return db
    .select()
    .from(organisationTable)
    .innerJoin(
      userOrganisationTable,
      eq(organisationTable.id, userOrganisationTable.organisationId)
    )
    .where(eq(userOrganisationTable.userId, userId));
}

export const organisationDao = {
  getOrganisation,
  getUserOrganisations,
};
