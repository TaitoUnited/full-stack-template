import { eq } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { organisationTable, userOrganisationTable } from './organisation.db';

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
