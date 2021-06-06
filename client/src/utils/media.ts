import { css } from 'styled-components';
import { theme } from '~constants/theme';

// eslint-disable-next-line
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never; // prettier-ignore
type CSSReturnType = ReturnType<typeof css>;
type CSSArgsType = ArgumentTypes<typeof css>;
type MediaQueryFn = (...args: CSSArgsType) => CSSReturnType;
type MediaQuery<B extends Record<string, any>> = {
  [K in keyof B]: MediaQueryFn;
};

const em = (px: number) => `${px / 16}em`;

export const media = Object.entries(theme.breakpoints).reduce((acc, [k, v]) => {
  const { min, max } = v as { min?: number; max?: number };
  const key = k as keyof typeof theme.breakpoints;

  if (min !== undefined && max !== undefined) {
    if (min === 0) {
      acc[key] = (template, ...args) => css`
        @media screen and (max-width: ${em(max)}) {
          ${css(template, ...args)}
        }
      `;
    } else if (max === Infinity) {
      acc[key] = (template, ...args) => css`
        @media screen and (min-width: ${em(min)}) {
          ${css(template, ...args)}
        }
      `;
    } else {
      acc[key] = (template, ...args) => css`
        @media screen and (min-width: ${em(min)}) and (max-width: ${em(max)}) {
          ${css(template, ...args)}
        }
      `;
    }
  } else {
    if (min) {
      acc[key] = (template, ...args) => css`
        @media screen and (min-width: ${em(min)}) {
          ${css(template, ...args)}
        }
      `;
    }

    if (max) {
      acc[key] = (template, ...args) => css`
        @media screen and (max-width: ${em(max)}) {
          ${css(template, ...args)}
        }
      `;
    }
  }

  return acc;
}, {} as MediaQuery<typeof theme.breakpoints>);
