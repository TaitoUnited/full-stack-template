// TODO: do we need airbnb config anymore?
// The `recommended` configs that are already added should suffice

module.exports = {
  parser: '@typescript-eslint/parser',

  // NOTE: using `plugin:` prefix makes it so that the corresponding
  // eslint plugin is automatically enabled and the rules are turned on
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',

    // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors.
    'prettier',
    'plugin:prettier/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },

  env: {
    node: true,
    jest: true,
  },

  rules: {
    // ESLint standard has confilicts with typescript
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    // Turn of stupid TS specific rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // Enforce absolute imports to be first
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external', 'internal'],
          ['parent', 'sibling', 'index'],
        ],
      },
    ],

    'prettier/prettier': 'error',

    'no-var': 'error', // No `var` plz - we are not savages anymore
  },
};
