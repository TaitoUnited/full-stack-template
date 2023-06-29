import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://this-will-be-provided-by-taito-cli.com',
    specPattern: 'test/**/*.spec.ts',
    fixturesFolder: 'test/fixtures',
    screenshotsFolder: 'test/screenshots',
    supportFile: 'test/support/index.js',
    videosFolder: 'test/videos',
  },
});
