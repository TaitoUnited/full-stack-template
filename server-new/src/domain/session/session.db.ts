import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '../user/user.db';

/**
 * See docs for Drizzle ORM integration with Lucia Auth:
 * https://lucia-auth.com/database/drizzle
 */
export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});
