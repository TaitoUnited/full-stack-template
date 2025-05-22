import { and, eq } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { userTable } from './user.db';
import { userOrganisationTable } from '../organisation/organisation.db';

async function getOrgUsers(db: DrizzleDb, params: { organisationId: string }) {
  return db
    .select({ id: userTable.id, name: userTable.name, email: userTable.email })
    .from(userTable)
    .innerJoin(
      userOrganisationTable,
      eq(userTable.id, userOrganisationTable.userId)
    )
    .where(eq(userOrganisationTable.organisationId, params.organisationId));
}

async function getOrgUser(
  db: DrizzleDb,
  params: { id: string; organisationId: string }
) {
  const [user] = await db
    .select({ id: userTable.id, name: userTable.name, email: userTable.email })
    .from(userTable)
    .innerJoin(
      userOrganisationTable,
      eq(userTable.id, userOrganisationTable.userId)
    )
    .where(
      and(
        eq(userTable.id, params.id),
        eq(userOrganisationTable.organisationId, params.organisationId)
      )
    );

  return user;
}

async function getUser(db: DrizzleDb, id: string) {
  const [user] = await db
    .select({ id: userTable.id, name: userTable.name, email: userTable.email })
    .from(userTable)
    .where(and(eq(userTable.id, id)));

  return user;
}

function getUserByEmail(db: DrizzleDb, email: string) {
  return db.select().from(userTable).where(eq(userTable.email, email));
}

function updateUserLastLogin(db: DrizzleDb, userId: string) {
  return db
    .update(userTable)
    .set({ lastLogin: new Date() })
    .where(eq(userTable.id, userId));
}

export const userService = {
  getOrgUsers,
  getOrgUser,
  getUser,
  getUserByEmail,
  updateUserLastLogin,
};
