/* eslint-disable */
export const shadowLarge = {
  boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.12)',
  offset: {
    x: 0,
    y: 16,
  },
  radius: 32,
  opacity: 0.12,
  color: {
    hex: '#000000',
    rgba: 'rgba(0, 0, 0, 0.12)',
  },
};
export const shadowMedium = {
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
  offset: {
    x: 0,
    y: 8,
  },
  radius: 24,
  opacity: 0.12,
  color: {
    hex: '#000000',
    rgba: 'rgba(0, 0, 0, 0.12)',
  },
};
export const shadowNormal = {
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
  offset: {
    x: 0,
    y: 4,
  },
  radius: 16,
  opacity: 0.12,
  color: {
    hex: '#000000',
    rgba: 'rgba(0, 0, 0, 0.12)',
  },
};
export const shadowSmall = {
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.12)',
  offset: {
    x: 0,
    y: 2,
  },
  radius: 6,
  opacity: 0.12,
  color: {
    hex: '#000000',
    rgba: 'rgba(0, 0, 0, 0.12)',
  },
};

export type ShadowsToken =
  | 'shadowLarge'
  | 'shadowMedium'
  | 'shadowNormal'
  | 'shadowSmall';
