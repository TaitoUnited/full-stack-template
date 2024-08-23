import { defineConfig } from 'vitest/config';

const mode = process.env.MODE || 'unit';

export default defineConfig({
  test: {
    include: mode === 'unit' ? ['**/*.test.ts'] : ['**/*.test.api.ts'],
    alias: {
      '~/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
