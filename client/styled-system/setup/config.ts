import { defineConfig } from '@pandacss/dev';

import * as helpers from './helpers';
import * as utilities from './utilities';
import * as shadows from '../tokens/shadows';
import * as colors from '../tokens/colors';
import * as spacing from '../tokens/spacing.json';
import * as sizes from '../tokens/sizes';
import * as radii from '../tokens/radii';
import * as typography from '../tokens/typography';
import { keyframes } from './keyframes';
import { globalCss } from './global';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  importMap: '~styled-system',

  // The output directory for your css system
  outdir: 'styled-system/generated',

  // Minify css in non-dev mode
  minify: isProd,

  // Don't use non-standard CSS properties
  shorthands: false,

  // Whether to use css reset
  preflight: true,

  // Where to look for your Panda CSS declarations
  include: ['./src/**/*.{ts,tsx}'],

  // Files to exclude
  exclude: [
    './src/styled-system/**/*',
    './src/locales/**/*',
    './src/images/**/*',
    './src/graphql/**/*',
    './src/**/*.stories.{ts,tsx}',
  ],

  jsxFramework: 'react',
  jsxStyleProps: 'none',

  globalCss,

  utilities,

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
        ...helpers.transformNumberTokens(sizes, value => `${value / 16}rem`),
      },
      spacing: {
        none: { value: '0rem' },
        ...helpers.transformNumberTokens(spacing, value => `${value / 16}rem`),
      },
    },

    textStyles: helpers.transformTypography(typography),
  },

  hooks: {
    'tokens:created': ({ configure }) => {
      configure({
        // Add $ prefix to token names so that it is clear that they are tokens
        formatTokenName: path => '$' + path.join('.'),
      });
    },
  },
});
