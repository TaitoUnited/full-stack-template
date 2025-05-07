import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';

import { type Role } from '~/src/utils/authorisation';
import { userTable } from '../user/user.db';

export const organisationTable = pgTable('organisation', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  name: text('name').notNull(),
});

export const userOrganisationTable = pgTable(
  'user_organisation',
  {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),

    role: text('role').$type<Role>().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisationTable.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.organisationId] }),
  })
);
