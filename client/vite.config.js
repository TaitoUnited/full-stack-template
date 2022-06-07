import path from 'path';
import react from '@vitejs/plugin-react';
import strip from '@rollup/plugin-strip';
import minifyTemplateLiterals from 'rollup-plugin-minify-html-literals';
import { defineConfig } from 'vite';
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import { taitoHtmlPlugin } from './src/html/html-plugin';

const ANALYZE = !!process.env.ANALYZE;
const OUT_DIR = path.resolve(__dirname, ANALYZE ? 'build' : '../../build');
const DEV_HOST = process.env.DEV_BINDADDR || '127.0.0.1';
const DEV_PORT = process.env.DEV_PORT || '3000';
const PUBLIC_HOST = process.env.DOCKER_HOST ? '192.168.99.100' : 'localhost';
const PUBLIC_PORT = process.env.COMMON_PUBLIC_PORT || DEV_PORT;

export default defineConfig(({ mode }) => ({
  publicDir: 'assets',
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
    'process.env.SENTRY_PUBLIC_DSN': JSON.stringify(process.env.SENTRY_PUBLIC_DSN), // prettier-ignore
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
        // Minify CSS-in-JS styles and GraphQL queries
        minifyTemplateLiterals({
          options: {
            shouldMinifyCSS: () => false,
            shouldMinify({ tag = '' }) {
              return tag === 'gql' || tag === 'css' || tag.includes('styled');
            },
          },
        }),
        optimizeLodashImports(),
        strip({ functions: ['console.log', 'console.warn'] }),
      ],
    },
    terserOptions: {
      format: { comments: false }, // Remove all comments
    },
  },
  plugins: [
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
    taitoHtmlPlugin(),
    react({
      exclude: /\.stories\.(t|j)sx?$/, // Exclude Storybook stories
      babel: { plugins: ['macros'] },
      jsxRuntime: mode === 'development' ? 'automatic' : 'classic',
    }),
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
  resolve: {
    alias: {
      '~constants': path.resolve(__dirname, 'src/constants'),
      '~services': path.resolve(__dirname, 'src/services'),
      '~shared': path.resolve(__dirname, 'shared'),
      '~graphql': path.resolve(__dirname, 'src/graphql/index'),
      '~uikit': path.resolve(__dirname, 'src/components/uikit/index'),
      '~components': path.resolve(__dirname, 'src/components'),
      '~utils': path.resolve(__dirname, 'src/utils'),
      '~types': path.resolve(__dirname, 'src/types')
    },
  },
}));