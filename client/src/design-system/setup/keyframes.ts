import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  fadeIn: {
    '0%': {
      opacity: '0',
    },
    '100%': {
      opacity: '1',
    },
  },
  fadeOut: {
    '0%': {
      opacity: '1',
    },
    '100%': {
      opacity: '0',
    },
  },
  fadeScaleIn: {
    '0%': {
      opacity: '0',
      transform: 'scale(0)',
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)',
    },
  },
  fadeFromBottom: {
    '0%': {
      opacity: '0',
      transform: 'translateY(var(--fade-from-bottom-offset, 8px))',
    },
    '100%': {
      opacity: '1',
      transform: 'translateY(0px)',
    },
  },
  fadeFromTop: {
    '0%': {
      opacity: '0',
      transform: 'translateY(var(--fade-from-top-offset, -8px))',
    },
    '100%': {
      opacity: '1',
      transform: 'translateY(0px)',
    },
  },
});
