import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

// Lingui reads its configuration from the module's default export.
// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  locales: ['en-FI', 'fi'],
  sourceLocale: 'en-FI',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: formatter({ lineNumbers: false }),
});
