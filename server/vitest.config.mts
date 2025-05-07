import { defineConfig } from 'vitest/config';

const mode = process.env.MODE || 'unit';

export default defineConfig({
  test: {
    /**
     * Use a naming convention to determine which kind tests to run.
     * Use `.test.api.ts` for API integration tests and `.test.unit.ts` for unit tests.
     * These tests are separated because they have different requirements
     * for setting up the environment and running the tests.
     */
    include: mode === 'api' ? ['**/*.test.api.ts'] : ['**/*.test.unit.ts'],
    /**
     * Only run tests in an isolated environment when running unit tests.
     * In API integration tests we want to have a shared global environment
     * where we can setup some shared base data, like logged in users,
     * before running the tests.
     */
    isolate: mode === 'unit',
    setupFiles: mode === 'api' ? './test/setup-api-tests.ts' : undefined,
    alias: {
      '~/': new URL('./', import.meta.url).pathname,
    },
  },
});
