import path from 'path';
import react from '@vitejs/plugin-react-swc';
import strip from '@rollup/plugin-strip';
import tsconfigPaths from 'vite-tsconfig-paths';
import pandaCss from '@pandacss/dev/postcss';
import { lingui } from '@lingui/vite-plugin';
import { defineConfig } from 'vite';
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import { taitoHtmlFragmentsPlugin } from './plugins/html-fragments-plugin';
import { minifyTemplateLiteralsPlugin } from './plugins/minify-template-literals-plugin';

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
        // Minify CSS-in-JS styles and GraphQL queries
        minifyTemplateLiteralsPlugin(),
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
        }),
      ],
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
    tsconfigPaths(),
    taitoHtmlFragmentsPlugin(),
    react({
      exclude: /\.stories\.(t|j)sx?$/, // Exclude Storybook stories
      plugins: [['@lingui/swc-plugin', {}]],
      jsxRuntime: mode === 'development' ? 'automatic' : 'classic',
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
