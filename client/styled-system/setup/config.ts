import { defineConfig } from '@pandacss/dev';

import * as helpers from './helpers';
import * as utilities from './utilities';
import * as shadows from '../tokens/shadows';
import * as colors from '../tokens/colors';
import * as spacing from '../tokens/spacing';
import * as sizes from '../tokens/sizes';
import * as radii from '../tokens/radii';
import { web as typography } from '../tokens/typography';
import { globalCss } from './global';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  cwd: './',

  // The output directory for your css system
  outdir: 'styled-system/generated',

  // Makse generated class names shorter and optimize css in non-dev mode
  hash: false,
  optimize: isProd,
  minify: isProd,

  // Don't use non-standard CSS properties
  shorthands: false,

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

  jsxFramework: 'react',

  globalCss,

  utilities,

  conditions: {
    light: '[data-color-scheme=light] &',
    dark: '[data-color-scheme=dark] &',
  },

  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },

    tokens: {
      shadows: {
        $none: { value: 'none' },
        ...helpers.transformShadows(shadows),
      },
      radii: {
        $none: { value: '0rem' },
        ...helpers.transformNumberTokens(radii, value => `${value}px`),
      },
      sizes: {
        $none: { value: '0rem' },
        ...helpers.transformNumberTokens(sizes, value => `${value / 16}rem`),
      },
      spacing: {
        $none: { value: '0rem' },
        ...helpers.transformNumberTokens(spacing, value => `${value / 16}rem`),
      },
    },

    // Colors need to be defined inside `semanticTokens` if you want to specify
    // both light and dark mode values
    semanticTokens: {
      colors: helpers.transformColors(colors),
    },

    textStyles: helpers.transformTypography(typography),
  },
});
