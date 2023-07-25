import { CSSObject } from 'styled-components';

import * as colors from '~design-tokens/colors';
import * as typography from '~design-tokens/typography';
import * as spacing from '~design-tokens/spacing';
import * as sizing from '~design-tokens/sizes';
import * as radii from '~design-tokens/radii';

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

// NOTE: `xxxxText` colors should be used on top of the base or muted version of that color

export const theme = {
  rem,
  media,
  colors: colors.light,
  typography: getTypographyWithRem(),
  spacing: { none: 0, ...spacing },
  sizing,
  radii,
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    normal: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // prettier-ignore
    medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // prettier-ignore
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // prettier-ignore
  },
};

export const darkTheme = {
  ...theme,
  colors: colors.dark,
};

export type Theme = typeof theme;
export type Typography = keyof Theme['typography'];
export type Color = keyof Theme['colors'];
export type Spacing = keyof Theme['spacing'];
export type Radius = keyof Theme['radii'];
export type Breakpoint = keyof Theme['media'];
export type Shadow = keyof Theme['shadows'];
export type Size = keyof Theme['sizing'];

function getTypographyWithRem() {
  return Object.entries(typography.web).reduce((acc, [key, value]) => {
    acc[key as typography.TypographyToken] = {
      ...value,
      fontSize: rem(value.fontSize),
    } as CSSObject;
    return acc;
  }, {} as Record<typography.TypographyToken, CSSObject>);
}
