/* oxlint-disable node/no-process-env */

import { defineConfig } from 'vitest/config';

const IS_CI = Boolean(process.env.CI ?? process.env.taito_mode === 'ci');

type TestMode = 'api' | 'integration' | 'unit';

function getTestMode(value: string | undefined): TestMode {
  switch (value) {
    case 'api':
    case 'integration':
    case 'unit':
      return value;
    case undefined:
      return 'unit';
    default:
      return 'unit';
  }
}

const mode = getTestMode(process.env.MODE);

/**
 * Use a naming convention to determine which kind tests to run.
 * Use `.test.(rest|graphql).api.ts` for API integration tests and `.test.unit.ts` for unit tests and `.test.integration.ts` for testing services.
 * These tests are separated because they have different requirements
 * for setting up the environment and running the tests.
 */
const include: Record<TestMode, string[]> = {
  api: ['**/*.test.(rest|graphql).api.ts'],
  unit: ['**/*.test.unit.ts'],
  integration: ['**/*.test.integration.ts'],
};

const setupFiles: Partial<Record<TestMode, string>> = {
  api: './test/setup/setup-test-files.ts',
  integration: './test/setup/setup-test-files.ts',
};

const globalSetup: Partial<Record<TestMode, string>> = {
  api: './test/setup/setup-test-global.ts',
  integration: './test/setup/setup-test-global.ts',
};

/**
 * Run unit tests in an isolated environment.
 * In API and integration tests we want to have a shared global environment where
 * we can setup some shared data, like logged in users, before running the tests.
 */
const isolate: Record<TestMode, boolean> = {
  unit: true,
  api: false,
  integration: false,
};
console.log('mode:', mode);
export default defineConfig({
  test: {
    silent: IS_CI, // suppress console logs
    fileParallelism: !IS_CI,
    hookTimeout: IS_CI ? 30000 : 10000,
    testTimeout: IS_CI ? 10000 : 5000,
    include: include[mode],
    isolate: isolate[mode],
    setupFiles: setupFiles[mode],
    globalSetup: globalSetup[mode],
    teardownTimeout: IS_CI ? 30000 : 10000,
    retry: IS_CI ? 2 : 0,
    alias: {
      '~/': new URL('./', import.meta.url).pathname,
    },
  },
});
