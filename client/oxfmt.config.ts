import { defineConfig } from 'oxfmt';

export default defineConfig({
  printWidth: 80,
  bracketSpacing: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  arrowParens: 'avoid',
  sortPackageJson: false,
  ignorePatterns: [
    'src/graphql/generated.d.ts',
    'src/styled-system/generated/**/*',
    'src/styled-system/tokens/**/*',
    'src/route-tree.gen.ts',
  ],
});
