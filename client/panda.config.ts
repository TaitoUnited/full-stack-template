import { defineConfig } from '@pandacss/dev';

// import * as colors from './design-system/colors';
// import * as typography from './design-system/typography';
import * as spacing from './design-system/spacing';
import * as sizes from './design-system/sizes';
import * as radii from './design-system/radii';

export default defineConfig({
  // The output directory for your css system
  outdir: 'styled-system',

  // Whether to use css reset
  preflight: true,

  // Where to look for your Panda CSS declarations
  include: ['./src/**/*.{ts,tsx}'],

  // Files to exclude
  exclude: [
    './src/locales/**/*',
    './src/images/**/*',
    './src/graphql/**/*',
    './src/**/*.stories.{ts,tsx}',
  ],

  logLevel: 'debug',

  jsxFramework: 'react',

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        spacing: {
          none: { value: '0rem' },
          ...mapToRem(spacing),
        },
        radii: {
          none: { value: '0rem' },
          ...mapToRem(radii),
        },
        sizes: {
          none: { value: '0rem' },
          ...mapToRem(sizes),
        },
      },
    },
  },
});

function mapToRem<T extends Record<string, any>, K extends keyof T>(tokens: T) {
  return Object.entries(tokens).reduce((acc, [key, value]) => {
    acc[key] = { value: `${value / 16}rem` };
    return acc;
  }, {} as Record<K, { value: `${string}rem` }>);
}
