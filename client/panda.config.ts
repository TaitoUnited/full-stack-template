import { defineConfig } from '@pandacss/dev';

import { keyframes } from './src/styled-system/setup/keyframes';
import { globalCss } from './src/styled-system/setup/global';
import * as helpers from './src/styled-system/setup/helpers';
import * as utilities from './src/styled-system/setup/utilities';
import * as shadows from './src/styled-system/tokens/shadows';
import * as colors from './src/styled-system/tokens/colors';
import * as spacing from './src/styled-system/tokens/spacing.json';
import * as sizes from './src/styled-system/tokens/sizes';
import * as radii from './src/styled-system/tokens/radii';
import * as typography from './src/styled-system/tokens/typography';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  importMap: '~/styled-system',

  // The output directory for your css system
  outdir: './src/styled-system/generated',

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
