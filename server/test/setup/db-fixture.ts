import { drizzle } from 'drizzle-orm/node-postgres';
import { test as base } from 'vitest';

import type { DrizzleDb } from '~/db';

import { getTestDbPool } from './setup-test-db';

let db: DrizzleDb | undefined;

export const test = base.extend<{ db: DrizzleDb }>({
  // Vitest requires fixture callbacks to destructure the shared context.
  // oxlint-disable-next-line no-empty-pattern
  db: async ({}, use) => {
    db ??= drizzle(await getTestDbPool());
    await use(db);
  },
});
