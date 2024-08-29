import { eq } from 'drizzle-orm';

import { getDb } from '.';
import { hashPassword } from '~/common/password';
import { userTable } from '~/core/user/user.db';
import { postTable } from '~/core/example/post/post.db';
import { chatMessageTable, chatTable } from '~/core/example/chat/chat.db';

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

  const userData: (typeof userTable.$inferInsert)[] = [
    {
      email: 'test1@user.com',
      name: 'Test user 1',
      passwordHash: '',
    },
    {
      email: 'test2@user.com',
      name: 'Test user 2',
      passwordHash: '',
    },
  ];

  for (const data of userData) {
    data.passwordHash = await hashPassword('password');
  }

  await db.insert(userTable).values(userData).onConflictDoNothing();

  const users = await db.select({ id: userTable.id }).from(userTable);

  console.log('Inserting posts per user...');

  for (const user of users) {
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
