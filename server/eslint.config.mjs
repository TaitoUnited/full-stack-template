import eslint from '@eslint/js';
import * as compat from '@eslint/compat';
import pluginTS from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginImport from 'eslint-plugin-import-x';
import pluginNode from 'eslint-plugin-n';

export default pluginTS.config(
  eslint.configs.recommended,
  ...pluginTS.configs.recommended,
  pluginImport.configs.typescript,
  pluginNode.configs['flat/recommended'],
  pluginPrettier,
  /**
   * No idea why this has to be defined in a separate object ¯\_(ツ)_/¯
   * If it is added to the main object, it will not ignore the files...
   */
  {
    ignores: ['node_modules', 'build', 'shared'],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      'import-x': compat.fixupPluginRules(pluginImport),
    },
    rules: {
      // Couldn't figure out how to use import-x/recommended so inlined the rules here
      'import-x/namespace': 'error',
      'import-x/default': 'error',
      'import-x/export': 'error',
      'import-x/no-unresolved': ['error', { ignore: ['~'] }],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-default-export': 'error',
      'import-x/order': [
        'error',
        {
          groups: [
            ['builtin', 'external', 'internal'],
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [{ pattern: '~/**', group: 'parent' }],
          'newlines-between': 'always',
        },
      ],
      'dot-notation': 'error',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-empty': 'off',
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtins': [
        'error',
        {
          version: '>=20.0.0',
          allowExperimental: true,
          ignores: [],
        },
      ],
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
