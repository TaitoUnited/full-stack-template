import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: './src/**/*.db.ts',
  out: './db/migrations',
} satisfies Config;
