import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '../../user/user.db';

export const chatTable = pgTable('chat', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  // User should only have one chat
  userId: uuid('user_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
});

export const chatMessageTable = pgTable('chat_message', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  content: text('content').notNull(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chatTable.id, { onDelete: 'cascade' }),
  // Author ID is null if the author is an AI
  authorId: uuid('author_id').references(() => userTable.id, {
    onDelete: 'cascade',
  }),
  authorType: text('author_type')
    .notNull()
    .default('ai')
    .$type<'ai' | 'user'>(),
});
