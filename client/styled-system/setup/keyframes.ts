import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeScaleIn: {
    '0%': { opacity: '0', transform: 'scale(0)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
});
