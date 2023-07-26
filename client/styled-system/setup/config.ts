import { defineConfig } from '@pandacss/dev';

import * as helpers from './helpers';
import * as utilities from './utilities';
import * as patterns from './patterns';
import * as shadows from '../tokens/shadows';
import * as colors from '../tokens/colors';
import * as spacing from '../tokens/spacing';
import * as sizes from '../tokens/sizes';
import * as radii from '../tokens/radii';
import { web as typography } from '../tokens/typography';
import { globalCss } from './global';
import { preset } from './preset';

export default defineConfig({
  // The output directory for your css system
  outdir: 'styled-system/generated',

  // Don't use baked-in Panda CSS default presets since they contain non-standard
  // CSS properties and they don't get tree shaken properly in the final JS bundle
  eject: true,
  presets: [preset],

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

  patterns,

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