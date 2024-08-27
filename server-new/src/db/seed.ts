import { getDb } from '.';
import { hashPassword } from '~/common/password';
import { userTable } from '~/core/example/user/user.db';
import { postTable } from '~/core/example/post/post.db';

/**
 * This file is used to seed the database with initial data.
 *
 * In larger projects you most likely want to split the seed logic into multiple
 * files per entity or feature. You can for example create a `seed` folder and
 * place the seed files there: `seed/user.ts`, `seed/post.ts`, etc. and then import
 * and run them here.
 */
async function seedDb() {
  console.log('Running database seed...');

  const db = await getDb();

  console.log('Inserting users...');

  const users: (typeof userTable.$inferInsert)[] = [
    {
      email: 'test1@user.com',
      name: 'Test user 1',
      passwordHash: hashPassword('password'),
    },
    {
      email: 'test2@user.com',
      name: 'Test user 2',
      passwordHash: hashPassword('password'),
    },
  ];

  const userResult = await db
    .insert(userTable)
    .values(users)
    .onConflictDoNothing()
    .returning();

  console.log('Inserting posts per user...');

  for (const user of userResult) {
    await db
      .insert(postTable)
      .values({
        authorId: user.id,
        title: 'Test post',
        content: 'Test content',
      })
      .onConflictDoNothing();
  }

  console.log('Database seed done!');
}

seedDb();
