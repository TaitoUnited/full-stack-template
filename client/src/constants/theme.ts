import type { CSSObject } from 'styled-components';

const lightColors = {
  // Brand colors
  primary: '#009A48',
  primaryText: '#015227',
  primaryMuted: '#d6ebdb',

  // Informative colors
  info: '#3B82F6',
  infoText: '#0A45A6',
  infoMuted: '#cfdef7',
  success: '#10B981',
  successText: '#06734E',
  successMuted: '#cee8df',
  warn: '#FBBF24',
  warnText: '#8a6200',
  warnMuted: '#f3ead1',
  error: '#EF4444',
  errorText: '#8C0606',
  errorMuted: '#f3d2d3',

  // Muted gray colors
  // Based on: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/
  muted1: '#8e8e93',
  muted2: '#aeaeb2',
  muted3: '#c7c7cc',
  muted4: '#d1d1d6',
  muted5: '#e5e5ea',
  muted6: '#f2f2f7',

  // Interaction plus generic colors for text, surfaces, borders, etc.
  text: '#222222',
  textMuted: '#666666',
  border: 'rgba(150, 150, 150, 0.3)',
  hoverHighlight: 'rgba(150,150,150,0.1)',
  activeHighlight: 'rgba(150,150,150,0.2)',
  focusRing: '#009A48',
  backdrop: 'rgba(0,0,0,0.5)', // modal backdrop etc.
  surface: '#FFFFFF', // cards, sidebars, navbars, etc.
  elevated: '#FFFFFF', // modals, drawers, etc.
  background: '#F3F4F6', // app main background
};

// TODO: fine-tune dark mode colors (eg. update vibrancy)
const darkColors = {
  // Brand colors
  primary: '#009A48',
  primaryText: '#1cff87',
  primaryMuted: '#24392a',

  // Informative colors
  info: '#3B82F6',
  infoText: '#81aef7',
  infoMuted: '#1b2940',
  success: '#10B981',
  successText: '#1ee8a5',
  successMuted: '#193328',
  warn: '#FBBF24',
  warnText: '#ffc93d',
  warnMuted: '#40351a',
  error: '#EF4444',
  errorText: '#ff7070',
  errorMuted: '#3e1c1d',

  // Muted gray colors
  muted1: '#8e8e93',
  muted2: '#636366',
  muted3: '#48484a',
  muted4: '#3a3a3c',
  muted5: '#2c2c2e',
  muted6: '#1d1d1f',

  // Interaction plus generic colors for text, surfaces, borders, etc.
  text: '#FFFFFF',
  textMuted: '#999999',
  border: 'rgba(150, 150, 150, 0.3)',
  hoverHighlight: 'rgba(150,150,150,0.08)',
  activeHighlight: 'rgba(150,150,150,0.2)',
  focusRing: '#009A48',
  backdrop: 'rgba(0,0,0,0.5)', // modal backdrop etc.
  surface: '#222222', // cards, sidebars, navbars, etc.
  elevated: '#333333', // modals, drawers, etc.
  background: '#111111', // app main background
};

const baseBreakpoints = {
  phone: { min: 0, max: 767 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1025, max: 1800 },
  monitor: { min: 1801, max: Infinity },
};

const breakpoints = {
  ...baseBreakpoints,
  tabletDown: { max: baseBreakpoints.tablet.max },
  tabletUp: { min: baseBreakpoints.tablet.min },
  desktopDown: { max: baseBreakpoints.desktop.max },
  desktopUp: { min: baseBreakpoints.desktop.min },
};

export const theme = {
  breakpoints,
  colors: lightColors,
  typography: {
    title1: {
      fontSize: 48,
      fontWeight: 700,
    } as CSSObject,
    title2: {
      fontSize: 32,
      fontWeight: 700,
    } as CSSObject,
    title3: {
      fontSize: 24,
      fontWeight: 700,
    } as CSSObject,
    subtitle: {
      fontSize: 16,
      fontWeight: 700,
    } as CSSObject,
    body: {
      fontSize: 16,
      fontWeight: 400,
    } as CSSObject,
    bodyLarge: {
      fontSize: 18,
      fontWeight: 400,
    } as CSSObject,
    bodySmall: {
      fontSize: 12,
      fontWeight: 400,
    } as CSSObject,
    overline: {
      fontSize: 10,
      textTransform: 'uppercase',
      fontWeight: 500,
      letterSpacing: 0.8,
    } as CSSObject,
    caption: {
      fontSize: 10,
      fontWeight: 400,
    } as CSSObject,
  },
  spacing: {
    xxsmall: 4,
    xsmall: 8,
    small: 12,
    normal: 16,
    medium: 24,
    large: 32,
    xlarge: 48,
    xxlarge: 56,
    xxxlarge: 72,
  },
  sizing: {
    button: {
      small: 32,
      normal: 44,
      large: 60,
    },
    icon: {
      small: 14,
      normal: 24,
      large: 32,
    },
  },
  radii: {
    small: 4,
    normal: 8,
    medium: 16,
    large: 24,
    full: 999,
  },
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    normal: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // prettier-ignore
    medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // prettier-ignore
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // prettier-ignore
  },
};

export const darkTheme = {
  ...theme,
  colors: darkColors,
};

export type Theme = typeof theme;
export type Typography = keyof Theme['typography'];
export type Color = keyof Theme['colors'];
export type Spacing = keyof Theme['spacing'];
export type Radius = keyof Theme['radii'];
export type Breakpoint = keyof Theme['breakpoints'];
export type Shadow = keyof Theme['shadows'];
export type Size = keyof Theme['sizing'];
