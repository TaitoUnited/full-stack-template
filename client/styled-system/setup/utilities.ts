import { PropertyConfig } from '@pandacss/types';

/**
 * NOTE: Utilities should be prefixed with $ to make it clear that they are
 * are not native CSS properties.
 *
 * Example usage:
 *
 * const StyledComponent = styled('div', {
 *   base: {
 *     $hoverHighlight: '',
 *     color: 'blue',
 *   },
 * });
 *
 * const styles = css({
 *   $hoverHighlight: '',
 *   color: 'red',
 * });
 */

export const $focusRing: PropertyConfig = {
  className: 'focus-ring',
  transform(_, { token }) {
    return {
      '&:focus-visible': {
        'box-shadow': `0px 0px 0px 2px ${token('colors.$focusRing')}`,
      },
    };
  },
};

export const $hoverHighlight: PropertyConfig = {
  className: 'hover-highlight',
  transform(_, { token }) {
    return {
      '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        backgroundColor: token('colors.$hoverHighlight'),
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
};

export const $pressHighlight: PropertyConfig = {
  className: 'press-highlight',
  transform(_, { token }) {
    return {
      '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        backgroundColor: token('colors.$pressHighlight'),
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
};

export const $pressOpacity: PropertyConfig = {
  className: 'press-opacity',
  transform() {
    return {
      opacity: 1,
      transition: 'opacity 50ms linear',
      '&:active': {
        opacity: 0.7,
      },
    };
  },
};
