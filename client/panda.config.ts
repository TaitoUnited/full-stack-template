import { defineConfig, defineTextStyles } from '@pandacss/dev';

import { web as typography } from './design-system/typography';
import * as shadows from './design-system/shadows';
import * as colors from './design-system/colors';
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

  jsxFramework: 'react',

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
      shadows: transformShadows(shadows),
      radii: {
        none: { value: '0rem' },
        ...transformNumberTokens(radii, value => `${value}px`),
      },
      sizes: {
        none: { value: '0rem' },
        ...transformNumberTokens(sizes, value => `${value / 16}rem`),
      },
      spacing: {
        none: { value: '0rem' },
        ...transformNumberTokens(spacing, value => `${value / 16}rem`),
      },
    },

    // Colors need to be defined inside `semanticTokens` if you want to specify
    // both light and dark mode values
    semanticTokens: {
      colors: transformColors(colors),
    },

    textStyles: transformTypography(typography),
  },

  patterns: {
    extend: {
      hoverHighlight: {
        description: 'A pseudo-element that highlights the element on hover',
        transform() {
          return {
            '&:after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              opacity: 0,
              backgroundColor: 'hoverHighlight',
              transition: 'opacity 50ms linear',
              borderRadius: 'inherit',
              pointerEvents: 'none',
            },
            '&:hover': {
              '&:after': {
                opacity: 1,
              },
            },
          };
        },
      },
      pressHighlight: {
        description: 'A pseudo-element that highlights the element on press',
        transform() {
          return {
            '&:after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              opacity: 0,
              backgroundColor: 'pressHighlight',
              transition: 'opacity 50ms linear',
              borderRadius: 'inherit',
              pointerEvents: 'none',
            },
            '&:active': {
              '&:after': {
                opacity: 1,
              },
            },
          };
        },
      },
    },
  },
});

// Helper functions to transform the design system tokens into Panda CSS format

function transformNumberTokens(
  tokens: Record<string, any>,
  transformer: (value: number) => string
) {
  return Object.entries(tokens).reduce<Record<string, { value: string }>>(
    (acc, [key, value]) => {
      acc[key] = { value: transformer(value) };
      return acc;
    },
    {}
  );
}

type TextStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  textTransform: string;
  letterSpacing: number;
  lineHeight: number;
};

function transformTypography(tokens: Record<string, TextStyle>) {
  return Object.entries(tokens).reduce((acc, [key, value]) => {
    acc[key] = {
      value: {
        fontFamily: value.fontFamily,
        fontWeight: value.fontWeight,
        fontSize: `${value.fontSize / 16}rem`,
        textTransform: value.textTransform,
        letterSpacing: value.letterSpacing,
        lineHeight: value.lineHeight,
      },
    };
    return acc;
  }, {} as ReturnType<typeof defineTextStyles>);
}

function transformColors(tokens: {
  light: Record<string, string>;
  dark: Record<string, string>;
}) {
  return Object.entries(tokens.light).reduce((acc, [key, value]) => {
    acc[key] = {
      value: {
        _light: value,
        _dark: tokens.dark[key],
      },
    };
    return acc;
  }, {} as Record<string, { value: { _light: string; _dark: string } }>);
}

type Shadow = {
  boxShadow: string;
  offset: { x: number; y: number };
  radius: number;
  opacity: number;
  color: { hex: string; rgba: string };
};

function transformShadows(tokens: Record<string, Shadow>) {
  return Object.entries(tokens).reduce((acc, [key, value]) => {
    // Due to the way shadows are named in Figma we need to remove the leading
    // "shadow" from the key: "shadowLarge" -> "large"
    const name = key.replace('shadow', '').toLowerCase();
    acc[name] = { value: value.boxShadow };
    return acc;
  }, {} as Record<string, { value: string }>);
}
