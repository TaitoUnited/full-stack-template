import { eq } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { userTable } from './user.db';

export async function getUsers(db: DrizzleDb) {
  return db.select().from(userTable);
}

export async function getUser(db: DrizzleDb, id: string) {
  const [user] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
    })
    .from(userTable)
    .where(eq(userTable.id, id));

  return user;
}

export function getUserByEmail(db: DrizzleDb, email: string) {
  return db.select().from(userTable).where(eq(userTable.email, email));
}

export function updateUserLastLogin(db: DrizzleDb, userId: string) {
  return db
    .update(userTable)
    .set({ lastLogin: new Date() })
    .where(eq(userTable.id, userId));
}
