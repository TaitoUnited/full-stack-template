import eslint from '@eslint/js';
import pluginPlaywright from 'eslint-plugin-playwright';
import pluginTS from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...pluginTS.configs.recommended,
  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
    rules: {
      ...pluginPlaywright.configs['flat/recommended'].rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      playwright: {
        globalAliases: {
          // Setup files alias import of test
          test: ['setup'],
        },
      },
    },
  },
];
