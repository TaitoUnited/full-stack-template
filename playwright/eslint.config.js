import playwright from 'eslint-plugin-playwright';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  playwright.configs['flat/recommended'],
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    rules: {
      // Customize Playwright rules
      // ...
    },
    settings: {
      playwright: {
        globalAliases: {
          // setup files alias import of test
          test: ['setup'],
        },
      },
    },
  },
];
