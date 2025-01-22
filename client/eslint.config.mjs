import pluginReact from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginLingui from 'eslint-plugin-lingui';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginPromise from 'eslint-plugin-promise';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import pluginTS from 'typescript-eslint';

export default pluginTS.config(
  eslint.configs.recommended,
  ...pluginTS.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  pluginJsxA11y.flatConfigs.recommended,
  pluginLingui.configs['flat/recommended'],
  pluginPromise.configs['flat/recommended'],
  pluginPrettier,
  /**
   * No idea why this has to be defined in a separate object ¯\_(ツ)_/¯
   * If it is added to the main object, it will not ignore the files...
   */
  {
    ignores: [
      // Ignore static/cache/compiled files
      'node_modules',
      'shared',
      'assets',
      'build',
      '.vite',
      '__mocks__',
      // Ignore config files
      'panda.config.ts',
      'vite.config.*',
      'eslint.config.*',
      '.storybook/vite.config.*',
      // Ignore generated files
      'src/graphql/generated.d.ts',
      'src/locales/',
      'src/styled-system/generated/',
      'src/styled-system/tokens/',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs['recommended-typescript'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-compiler': pluginReactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      // We are smart devs so using cloneElement/Children is fine :D
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-children-count': 'off',
      '@eslint-react/no-children-map': 'off',
      // We shouldn't use context for perf sensitive things so this can be off
      '@eslint-react/no-unstable-context-value': 'off',
      'react-hooks/rules-of-hooks': 'error',
      // This rule is simply just totally wrong so often that it's not worth it
      'react-hooks/exhaustive-deps': 'off',
      'import/no-unresolved': [
        'error',
        {
          ignore: ['~shared'],
        },
      ],
      // Enforce sorting of import members within a single import statement
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true, // Let 'import/order' handle this
          ignoreMemberSort: false, // Enforce member sorting
        },
      ],
      // Enforce sorting of entire import statements
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            ['builtin', 'external'], // Built-in and external libraries
            ['internal'], // Internal imports
            ['parent', 'sibling', 'index'], // Local imports
          ],
          pathGroups: [{ pattern: '{~*,~*/**}', group: 'internal' }],
          'newlines-between': 'always',
        },
      ],
      'func-style': ['error', 'declaration'],
      'dot-notation': 'error',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-empty': 'off',
      'n/no-missing-import': 'off',
      // We should use the custom link component in order to benefit from automatic preloading
      'no-restricted-imports': [
        'error',
        {
          name: '@tanstack/react-router',
          importNames: ['Link'],
          message: 'Please use custom Link instead.',
        },
        {
          name: 'react-aria-components',
          importNames: ['Link'],
          message: 'Please use custom Link instead.',
        },
        {
          name: '~styled-system/jsx',
          importNames: ['Stack'],
          message: 'Please use custom Stack from uikit instead.',
        },
        {
          name: '@lingui/react',
          importNames: ['Trans', 'useLingui'],
          message: 'Please use the @lingui/react/macro instead.',
        },
        {
          name: '@apollo/client',
          importNames: ['useQuery', 'useSuspenseQuery', 'useReadQuery', 'gql'],
          message:
            'Please use GraphQL related hooks and utils from ~graphql alias.',
        },
        {
          name: 'gql.tada',
          importNames: ['graphql'],
          message:
            'Please use GraphQL related hooks and utils from ~graphql alias.',
        },
        {
          name: 'graphql',
          importNames: ['graphql'],
          message:
            'Please use GraphQL related hooks and utils from ~graphql alias.',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  }
);
