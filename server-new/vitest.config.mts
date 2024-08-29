import { defineConfig } from 'vitest/config';

const mode = process.env.MODE || 'unit';

export default defineConfig({
  test: {
    include:
      mode === 'integration'
        ? ['**/*.routes.test.ts']
        : ['**/!(*.routes).test.ts'],
    alias: {
      '~/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
