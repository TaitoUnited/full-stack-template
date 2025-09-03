import { beforeAll, inject } from 'vitest';

import { type DrizzleDb } from '~/db';
import { getTestDb } from './setup-test-db';
import { TestData } from './setup-types';

/**
 * This file exists to make the test data initialised in setup-api-tests.ts
 * and database globally available without requiring inject() in each file.
 * It's run separately for each test file. If some setup operations need to
 * be run before each test file, they can be added here. Test file specific setup
 * should be done in the test files themselves.
 */

const injectedTestData = inject('testData');

/* eslint-disable no-var */
declare global {
  var testData: TestData;
  var testDb: DrizzleDb;
}

beforeAll(async () => {
  if (!injectedTestData) {
    throw new Error('Test data not found! Cannot run tests.');
  }

  // Skip if already setup
  if (!globalThis.testData) {
    globalThis.testData = injectedTestData;
  }
  if (!globalThis.testDb) {
    const db = await getTestDb();
    globalThis.testDb = db;
  }
});
