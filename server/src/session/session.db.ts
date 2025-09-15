import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '../user/user.db';

/**
 * See docs for Drizzle ORM integration with Lucia Auth:
 * https://lucia-auth.com/database/drizzle
 */
export const sessionTable = pgTable('session', {
  /**
   * In Lucia docs the id field is defined as `text` but you can change the type
   * if needed: https://lucia-auth.com/basics/sessions#custom-session-ids
   */
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
    withTimezone: true,
    mode: 'date',
  }),
});

export type DBSession = typeof sessionTable.$inferSelect;
