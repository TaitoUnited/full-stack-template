import { lingui, linguiTransformerBabelPreset } from '@lingui/vite-plugin';
import pandaCss from '@pandacss/dev/postcss';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { iconSpritesheet } from '../plugins/icon-spritesheet-plugin.js';

export default defineConfig(() => ({
  publicDir: 'assets',
  define: {
    'process.env.API_URL': JSON.stringify('/no-api-available'),
  },
  css: {
    postcss: {
      plugins: [pandaCss()],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    iconSpritesheet(),
    lingui(),
    react(),
    babel({
      presets: [reactCompilerPreset(), linguiTransformerBabelPreset()],
    }),
  ],
}));
