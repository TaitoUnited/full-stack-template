import { pgTable, timestamp, text, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '../user/user.db';

export const postTable = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
});
