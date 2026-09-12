import path from 'path';

import { lingui, linguiTransformerBabelPreset } from '@lingui/vite-plugin';
import pandaCss from '@pandacss/dev/postcss';
import babel from '@rolldown/plugin-babel';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import favicons from '@peterek/vite-plugin-favicons';
import { visualizer } from 'rollup-plugin-visualizer';
import { type ConfigEnv, defineConfig } from 'vite';
import { splashScreen } from 'vite-plugin-splash-screen';
import { watchAndRun } from 'vite-plugin-watch-and-run';

import { routeConfig } from './src/route-config.ts';
import { iconSpritesheet } from './plugins/icon-spritesheet-plugin.js';

const ANALYZE = !!process.env.ANALYZE;
const OUT_DIR = path.resolve(
  import.meta.dirname,
  ANALYZE ? 'build' : '../../build'
);
const DEV_HOST = process.env.DEV_BINDADDR || '127.0.0.1';
const DEV_PORT = Number(process.env.DEV_PORT ?? 3000);
const PUBLIC_HOST = process.env.DOCKER_HOST ? '192.168.99.100' : 'localhost';
const PUBLIC_PORT = Number(process.env.COMMON_PUBLIC_PORT ?? DEV_PORT);

// Panda's PostCSS plugin type is not yet compatible with Vite's config type.
const pandacssPlugin = pandaCss() as any;

export default defineConfig(({ mode }: ConfigEnv) => ({
  publicDir: 'assets',
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
  },
  css: {
    postcss: {
      plugins: [pandacssPlugin],
    },
  },
  build: {
    outDir: OUT_DIR,
    sourcemap: mode === 'production' || ANALYZE,
  },
  plugins: [
    splashScreen({
      logoSrc: 'logo.svg',
      splashBg: '#ffffff',
      loaderBg: '#009a48',
      loaderType: 'line',
      minDurationMs: 500,
    }),
    watchAndRun([
      {
        name: 'Watch GraphQL schema',
        watchKind: ['change'],
        watch: path.resolve('shared/schema.gql'),
        run: 'npm run generate:graphql',
        delay: 300,
      },
    ]),
    tanstackRouter({
      virtualRouteConfig: routeConfig,
      generatedRouteTree: './src/route-tree.gen.ts',
      autoCodeSplitting: true,
      quoteStyle: 'single',
      semicolons: true,
      target: 'react',
    }),
    iconSpritesheet(),
    favicons('assets/icon.png', {
      appName: 'Taito app',
      appShortName: 'Taito',
      appDescription: 'Taito fullstack template app',
      developerName: 'Taito United',
      developerURL: 'https://github.com/TaitoUnited',
      lang: 'fi',
      background: '#ffffff',
      theme_color: '#2b2b2b',
      display: 'standalone',
      start_url: '.',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        windows: false,
        yandex: false,
        favicons: true,
      },
    }),
    lingui(),
    react(),
    babel({
      // Lingui must run after React Compiler.
      presets: [reactCompilerPreset(), linguiTransformerBabelPreset()],
    }),
    ANALYZE &&
      visualizer({
        open: true,
        filename: 'bundle-analysis.html',
        title: 'Bundle Analysis',
        gzipSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: DEV_HOST,
    port: DEV_PORT,
    strictPort: true,
    hmr: {
      host: PUBLIC_HOST,
      clientPort: PUBLIC_PORT,
    },
  },
  test: {
    dir: 'src',
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.tsx',
    css: false,
  },
}));
