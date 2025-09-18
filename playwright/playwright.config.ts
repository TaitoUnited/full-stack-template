import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';

const IS_CI = Boolean(process.env.CI || process.env.taito_mode === 'ci');
const TEST_BASE_URL = process.env.TEST_BASE_URL;

// Read default environment variables when we are executing tests locally
if (!IS_CI) {
  // ES Modules in Node.js do not have __dirname or __filename
  const filename = url.fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  dotenv.config({
    path: [path.resolve(dirname, `.env.local`), path.resolve(dirname, `.env`)],
  });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '*.spec.ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: IS_CI,
  /* Retry on CI only */
  retries: IS_CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: IS_CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  expect: {
    /* Timeout for `expect()` */
    timeout: IS_CI ? 10000 : 5000, // 10s on CI, 5s locally
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: TEST_BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Viewport size ("Laptop L" in Chrome's inspector) */
    viewport: { width: 1440, height: 955 },
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project, eg. perform login before running tests
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        // Use prepared auth state.
        storageState: '.auth/user.json',
      },
    },

    // {
    //   name: 'firefox',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     // Use prepared auth state.
    //     storageState: '.auth/user.json',
    //   },
    // },

    // {
    //   name: 'webkit',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Desktop Safari'],
    //     // Use prepared auth state.
    //     storageState: '.auth/user.json',
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Pixel 5'],
    //     // Use prepared auth state.
    //     storageState: '.auth/user.json',
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['iPhone 12'],
    //     // Use prepared auth state.
    //     storageState: '.auth/user.json',
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //     // Use prepared auth state.
    //     storageState: '.auth/user.json',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //     // Use prepared auth state.
    //     storageState: '.auth/user.json',
    //   },
    // },
  ],
});
