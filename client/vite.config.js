import path from 'path';
import react from '@vitejs/plugin-react';
import strip from '@rollup/plugin-strip';
import tsconfigPaths from 'vite-tsconfig-paths';
import pandaCss from '@pandacss/dev/postcss';
import { lingui } from '@lingui/vite-plugin';
import { defineConfig } from 'vite';
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2';
import { splashScreen } from 'vite-plugin-splash-screen';
import { watchAndRun } from 'vite-plugin-watch-and-run';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

import { routeConfig } from './src/route-config';
import { iconSpritesheet } from './plugins/icon-spritesheet-plugin';

const ANALYZE = !!process.env.ANALYZE;
const OUT_DIR = path.resolve(__dirname, ANALYZE ? 'build' : '../../build');
const DEV_HOST = process.env.DEV_BINDADDR || '127.0.0.1';
const DEV_PORT = process.env.DEV_PORT || '3000';
const PUBLIC_HOST = process.env.DOCKER_HOST ? '192.168.99.100' : 'localhost';
const PUBLIC_PORT = process.env.COMMON_PUBLIC_PORT || DEV_PORT;

export default defineConfig(({ mode }) => ({
  publicDir: 'assets',
  cacheDir: '.vite',
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN), // prettier-ignore
    'process.env.GA_TRACKING_ID': JSON.stringify(process.env.GA_TRACKING_ID),
  },
  build: {
    outDir: OUT_DIR,
    sourcemap: mode === 'production' || ANALYZE,
    rollupOptions: {
      output: {
        // Put libs that are not core to the main app into separate chunks
        manualChunks: {
          sentry: ['@sentry/browser'],
        },
      },
      plugins: [
        optimizeLodashImports(),
        strip({ functions: ['console.log', 'console.warn'] }),
      ],
    },
  },
  css: {
    postcss: {
      plugins: [
        pandaCss({
          configPath: './styled-system/setup/config.ts',
          cwd: __dirname,
        }),
      ],
    },
  },
  plugins: [
    watchAndRun([
      {
        name: 'Watch GraphQL schema',
        watchKind: ['change'],
        watch: path.resolve('shared/schema.gql'),
        run: 'npm run generate:graphql',
        delay: 300,
      },
    ]),
    splashScreen({
      logoSrc: 'logo.svg',
      splashBg: '#ffffff',
      loaderBg: '#009a48',
      loaderType: 'line',
      minDurationMs: 500,
    }),
    TanStackRouterVite({
      virtualRouteConfig: routeConfig,
      generatedRouteTree: './src/route-tree.gen.ts',
      autoCodeSplitting: true,
      quoteStyle: 'single',
      semicolons: true,
    }),
    iconSpritesheet(),
    // Generate favicons only on production since it slows down the dev build
    mode === 'production' &&
      ViteFaviconsPlugin({
        inject: true,
        logo: 'assets/icon.png',
        favicons: {
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
            // Don't include unnecessary icons
            coast: false,
            yandex: false,
            windows: false,
            appleStartup: false,
          },
        },
      }),
    tsconfigPaths(),
    react({
      exclude: /\.stories\.(t|j)sx?$/, // Exclude Storybook stories
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro', 'macros'],
      },
    }),
    lingui(),
  ].filter(Boolean),
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
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.tsx',
    css: false,
  },
}));
