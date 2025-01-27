import * as colors from './colors';
import * as radii from './radii';
import * as shadows from './shadows';
import * as spacing from './spacing.json';
import * as typography from './typography';

export type Color = keyof typeof colors;
export type Radii = keyof typeof radii;
export type Shadow = keyof typeof shadows;
export type Spacing = keyof typeof spacing;
export type Typography = keyof typeof typography;
