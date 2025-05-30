import { defineConfig } from '@lingui/cli'; // eslint-disable-line import/no-unresolved
import { formatter } from '@lingui/format-po';

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
