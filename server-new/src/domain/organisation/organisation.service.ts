import { eq } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { organisationTable, userOrganisationTable } from './organisation.db';

export async function getOrganisation(db: DrizzleDb, id: string) {
  return db
    .select({ id: organisationTable.id, name: organisationTable.name })
    .from(organisationTable)
    .where(eq(organisationTable.id, id))
    .then((rows) => rows[0]);
}

export async function getUserOrganisations(db: DrizzleDb, userId: string) {
  return db
    .select()
    .from(organisationTable)
    .innerJoin(
      userOrganisationTable,
      eq(organisationTable.id, userOrganisationTable.organisationId)
    )
    .where(eq(userOrganisationTable.userId, userId));
}
