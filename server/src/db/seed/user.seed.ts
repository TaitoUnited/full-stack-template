import { type DrizzleDb } from '../index';
import { hashPassword } from '~/utils/password';
import { userTable } from '~/domain/user/user.db';

export type User = {
  id: string;
  name: string;
};

export type UserSeed = {
  user1: User;
  user2: User;
  user3: User;
  user4: User;
};

export async function seed(db: DrizzleDb): Promise<UserSeed> {
  const user1 = await createUser(db, {
    email: 'john@doe.com',
    name: 'John Doe',
  });

  const user2 = await createUser(db, {
    email: 'jane@moe.com',
    name: 'Jane Moe',
  });

  const user3 = await createUser(db, {
    email: 'alex@zoe.com',
    name: 'Alex Zoe',
  });

  const user4 = await createUser(db, {
    email: 'mike@poe.com',
    name: 'Mike Poe',
  });

  return { user1, user2, user3, user4 };
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
