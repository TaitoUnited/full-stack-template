import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import pandaCss from '@pandacss/dev/postcss';
import { lingui } from '@lingui/vite-plugin';
import { defineConfig } from 'vite';
import { iconSpritesheet } from '../plugins/icon-spritesheet-plugin';

export default defineConfig(() => ({
  publicDir: 'assets',
  define: {
    'process.env.API_URL': JSON.stringify('/no-api-available'),
  },
  css: {
    postcss: {
      plugins: [pandaCss({ configPath: './styled-system/setup/config.ts' })],
    },
  },
  plugins: [
    iconSpritesheet(),
    tsconfigPaths(),
    react({ babel: { plugins: ['macros'] } }),
    lingui(),
  ],
}));
