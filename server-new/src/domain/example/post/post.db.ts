import { pgTable, timestamp, text, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '~/domain/user/user.db';
import { organisationTable } from '~/domain/organisation/organisation.db';

export const postTable = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
  organisationId: uuid('organisation_id')
    .references(() => organisationTable.id, { onDelete: 'cascade' })
    .notNull(),
});
