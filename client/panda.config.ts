import { defineConfig } from '@pandacss/dev';

import { keyframes } from './src/design-system/setup/keyframes';
import { globalCss } from './src/design-system/setup/global';
import { stackPattern, textPattern } from './src/design-system/setup/patterns';
import * as helpers from './src/design-system/setup/helpers';
import * as utilities from './src/design-system/setup/utilities';
import * as shadows from './src/design-system/tokens/shadows';
import * as colors from './src/design-system/tokens/colors';
import * as spacing from './src/design-system/tokens/spacing.json';
import * as sizes from './src/design-system/tokens/sizes';
import * as radii from './src/design-system/tokens/radii';
import * as typography from './src/design-system/tokens/typography';

const rootFontSize = 16;

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  importMap: '~/design-system',

  // The output directory for your css system
  outdir: './src/design-system/generated',

  poll: true,

  // Don't use non-standard CSS properties
  shorthands: false,

  // Whether to use css reset
  preflight: true,

  hash: {
    cssVar: false,
    className: true,
  },

  minify: isProd,
  clean: isProd,

  presets: [],

  // Where to look for your Panda CSS declarations
  include: ['./src/**/*.{ts,tsx}'],

  // Files to exclude
  exclude: [
    './src/design-system/**/*',
    './src/locales/**/*',
    './src/images/**/*',
    './src/graphql/**/*',
    './src/**/*.stories.{ts,tsx}',
  ],

  jsxFramework: 'react',
  jsxStyleProps: 'none',

  globalCss,

  utilities,

  /**
   * Certain UI components, such as `Stack` and `Text`, rely on these patterns
   * for responsive prop handling, eg:
   * `<Stack direction={{ base: 'row', mdDown: 'column' }} />`
   * `<Text variant={{ base: 'body', mdDown: 'bodyS' }} />`
   */
  patterns: {
    extend: {
      stack: stackPattern,
      text: textPattern,
    },
  },

  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },

    keyframes,

    tokens: {
      colors: helpers.transformColors(colors),
      shadows: {
        none: { value: 'none' },
        ...helpers.transformShadows(shadows),
      },
      radii: {
        none: { value: '0rem' },
        ...helpers.transformNumberTokens(radii, value => `${value}px`),
      },
      sizes: {
        none: { value: '0rem' },
        ...helpers.transformNumberTokens(
          sizes,
          value => `${value / rootFontSize}rem`
        ),
      },
      spacing: {
        none: { value: '0rem' },
        ...helpers.transformNumberTokens(
          spacing,
          value => `${value / rootFontSize}rem`
        ),
      },
    },

    textStyles: helpers.transformTypography(typography),
  },

  hooks: {
    'tokens:created': ({ configure }) => {
      configure({
        formatTokenName: path => {
          const last = path[path.length - 1];
          const rest = path.slice(0, -1);
          return [...rest, `$${last}`].join('.');
        },
      });
    },
  },
});
