import { env } from 'node:process';

import { defineConfig } from 'vitest/config';

const IS_CI = Boolean(env.CI ?? env.taito_mode === 'ci');

const mode =
  env.MODE === 'api' || env.MODE === 'integration' ? env.MODE : 'unit';

/**
 * Use a naming convention to determine which kind tests to run.
 * Use `.test.(rest|graphql).api.ts` for API integration tests and `.test.unit.ts` for unit tests and `.test.integration.ts` for testing services.
 * These tests are separated because they have different requirements
 * for setting up the environment and running the tests.
 */
const include = {
  api: ['**/*.test.(rest|graphql).api.ts'],
  unit: ['**/*.test.unit.ts'],
  integration: ['**/*.test.integration.ts'],
};

const setupFiles = {
  api: './test/setup/setup-test-files.ts',
  integration: './test/setup/setup-test-files.ts',
  unit: [] as string[],
};

const globalSetup = {
  api: './test/setup/setup-test-global.ts',
  integration: './test/setup/setup-test-global.ts',
  unit: [] as string[],
};

console.log(`Is running on CI: ${IS_CI}, with mode: ${mode}`);

export default defineConfig({
  test: {
    retry: 0,
    silent: IS_CI,
    fileParallelism: true,
    maxWorkers: IS_CI ? 2 : undefined,
    minWorkers: IS_CI ? 1 : undefined,
    hookTimeout: IS_CI ? 30000 : 10000,
    testTimeout: IS_CI ? 30000 : 10000,
    teardownTimeout: IS_CI ? 30000 : 10000,
    include: include[mode],
    // Provider mocks and process globals must not leak between test files.
    isolate: true,
    setupFiles: setupFiles[mode],
    globalSetup: globalSetup[mode],
    alias: {
      '~/': new URL('./', import.meta.url).pathname,
    },
  },
});
