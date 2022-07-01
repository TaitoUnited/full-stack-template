import type { CSSObject } from 'styled-components';

const lightColors = {
  // Brand colors
  primary: '#009A48',
  primaryText: '#015227',
  primaryMuted: '#d6ebdb',
  onPrimary: '#ffffff', // color when text/icon/etc is on primary color

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
  onPrimary: '#ffffff', // color when text/icon/etc is on primary color

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

const rem = (px: number) => `${px / 16}rem`;
const em = (px: number) => `${px / 16}em`;

const breakpoints = {
  phone: { min: 0, max: 767 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1025, max: 1800 },
  monitor: { min: 1801, max: Infinity },
};

const media = {
  phone: `@media (max-width: ${em(breakpoints.phone.max)})`,
  tablet: `@media (min-width: ${em(breakpoints.tablet.min)}) and (max-width: ${em(breakpoints.tablet.max)})`, // prettier-ignore
  tabletDown: `@media (max-width: ${em(breakpoints.tablet.max)})`,
  tabletUp: `@media (min-width: ${em(breakpoints.tablet.min)})`,
  desktop: `@media (min-width: ${em(breakpoints.desktop.min)}) and (max-width: ${em(breakpoints.desktop.max)})`, // prettier-ignore
  desktopDown: `@media (max-width: ${em(breakpoints.desktop.max)})`,
  desktopUp: `@media (min-width: ${em(breakpoints.desktop.min)})`,
  monitor: `@media (min-width: ${em(breakpoints.monitor.min)})`,
};

export const theme = {
  rem,
  media,
  colors: lightColors,
  typography: {
    title1: { fontSize: rem(48), fontWeight: 800 } as CSSObject,
    title2: { fontSize: rem(32), fontWeight: 800 } as CSSObject,
    title3: { fontSize: rem(24), fontWeight: 800 } as CSSObject,
    title4: { fontSize: rem(18), fontWeight: 800 } as CSSObject,
    bodyLarge: { fontSize: rem(18), fontWeight: 400 } as CSSObject,
    bodyLargeStrong: { fontSize: rem(18), fontWeight: 600 } as CSSObject,
    body: { fontSize: rem(16), fontWeight: 400 } as CSSObject,
    bodyStrong: { fontSize: rem(16), fontWeight: 600 } as CSSObject,
    bodySmall: { fontSize: rem(12), fontWeight: 400 } as CSSObject,
    bodySmallStrong: { fontSize: rem(12), fontWeight: 600 } as CSSObject,
    caption: { fontSize: rem(10), fontWeight: 400 } as CSSObject,
    overline: {
      fontSize: rem(10),
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: 1.2,
    } as CSSObject,
  },
  spacing: {
    none: 0,
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
export type Breakpoint = keyof Theme['media'];
export type Shadow = keyof Theme['shadows'];
export type Size = keyof Theme['sizing'];
