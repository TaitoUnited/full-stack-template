/* oxlint-disable typescript/no-unnecessary-condition */

import { beforeAll, inject } from 'vitest';

import type { TestData } from './setup-types';

/**
 * This file makes the test data initialised in setup-test-global.ts globally
 * available without requiring inject() in each file. Database-backed tests use
 * the `db` fixture instead of a global database handle.
 * It's run separately for each test file. If some setup operations need to
 * be run before each test file, they can be added here. Test file specific setup
 * should be done in the test files themselves.
 */

const injectedTestData = inject('testData');

/* oxlint-disable no-var */
declare global {
  var testData: TestData;
}

beforeAll(() => {
  if (!injectedTestData) {
    throw new Error('Test data not found! Cannot run tests.');
  }

  globalThis.testData = injectedTestData;
});
