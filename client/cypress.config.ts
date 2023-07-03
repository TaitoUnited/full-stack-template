import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // NOTE: when you run the tests via taito-cli (`taito cypress:client`)
    // the baseUrl is automatically set to the correct value.
    baseUrl: 'http://localhost:8080',
    specPattern: 'test/**/*.spec.ts',
    fixturesFolder: 'test/fixtures',
    screenshotsFolder: 'test/screenshots',
    supportFile: 'test/support/index.js',
    videosFolder: 'test/videos',
  },
});
