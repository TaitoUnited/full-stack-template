import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { userTable } from '../../user/user.db';

export const chatTable = pgTable('chat', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  // User should only have one chat
  userId: uuid('user_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
});

export const chatMessageTable = pgTable('chatMessage', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  chatId: uuid('chat_id')
    .notNull()
    .references(() => chatTable.id, { onDelete: 'cascade' }),
  // Author ID is null if the author is an AI
  authorId: uuid('author_id').references(() => userTable.id, {
    onDelete: 'cascade',
  }),
  authorType: varchar('author_type', { length: 50 })
    .notNull()
    .default('ai')
    .$type<'ai' | 'user'>(),
  content: text('content').notNull(),
});
