import { type DrizzleDb } from '../index';
import { hashPassword } from '~/utils/password';
import { userTable } from '~/domain/user/user.db';

export type User = {
  id: string;
  name: string;
};

export type UserSeed = {
  admin: User;
  manager: User;
  viewer: User;
  user1: User;
  user2: User;
  user3: User;
};

export async function seed(db: DrizzleDb): Promise<UserSeed> {
  const admin = await createUser(db, {
    email: 'admin@test.com',
    name: 'Adam Admin',
  });

  const manager = await createUser(db, {
    email: 'manager@test.com',
    name: 'Mike Manager',
  });

  const viewer = await createUser(db, {
    email: 'viewer@test.com',
    name: 'Vanessa Viewer',
  });

  const user1 = await createUser(db, {
    email: 'user1@test.com',
    name: 'Uma User1',
  });

  const user2 = await createUser(db, {
    email: 'user2@test.com',
    name: 'Ulysses User2',
  });

  const user3 = await createUser(db, {
    email: 'user3@test.com',
    name: 'Uriah User3',
  });

  return { admin, manager, viewer, user1, user2, user3 };
}

// Helpers

async function createUser(
  db: DrizzleDb,
  data: { email: string; name: string }
) {
  const passwordHash = await hashPassword('password');
  const values = { ...data, passwordHash };

  return db
    .insert(userTable)
    .values(values)
    .onConflictDoUpdate({ target: userTable.email, set: values })
    .returning({ id: userTable.id, name: userTable.name })
    .then((rows) => rows[0]!);
}
