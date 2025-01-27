import { type PropertyConfig } from '@pandacss/types';

/**
 * NOTE: Utilities should be prefixed with $ to make it clear that they are
 * are not native CSS properties.
 *
 * Example usage:
 *
 * const StyledComponent = styled('div', {
 *   base: {
 *     $hoverHighlight: true,
 *     color: 'blue',
 *   },
 * });
 *
 * const styles = css({
 *   $hoverHighlight: true,
 *   color: 'red',
 * });
 */

export const $focusRing: PropertyConfig = {
  className: 'focus-ring',
  values: { type: 'boolean' },
  transform(value, { token }) {
    if (!value) {
      return {};
    }
    return {
      outline: `2px solid ${token('$colors.focusRing')}`,
    };
  },
};

export const $hoverHighlight: PropertyConfig = {
  className: 'hover-highlight',
  values: { type: 'boolean' },
  transform(value: boolean) {
    if (!value) {
      return {
        position: 'relative',
      };
    }
    return {
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
  values: { type: 'boolean' },
  transform(value: boolean) {
    if (!value) {
      return {
        position: 'relative',
      };
    }
    return {
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  values: { type: 'boolean' },
  transform(value: boolean) {
    if (!value) {
      return {};
    }
    return {
      opacity: 1,
      transition: 'opacity 50ms linear',
      '&:active': {
        opacity: 0.7,
      },
    };
  },
};

export const $truncate: PropertyConfig = {
  className: 'truncate',
  values: { type: 'boolean' },
  transform(value: boolean) {
    if (!value) {
      return {};
    }
    return {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    };
  },
};

export const $fadeIn: PropertyConfig = {
  className: 'fade-in',
  values: { type: 'number' },
  transform(duration: number) {
    if (typeof duration !== 'number') {
      return {};
    }
    return {
      opacity: 0,
      animation: `fadeIn ${duration}ms forwards`,
    };
  },
};

export const $fadeOut: PropertyConfig = {
  className: 'fade-out',
  values: { type: 'string' },
  transform(options) {
    return {
      opacity: 0,
      animation: `fadeOut ${options} forwards`,
    };
  },
};

export const $fadeScaleIn: PropertyConfig = {
  className: 'fade-scale-in',
  values: { type: 'string' },
  transform(options: number) {
    return {
      opacity: 0,
      animation: `fadeScaleIn ${options} forwards`,
    };
  },
};

export const $fadeFromBottom: PropertyConfig = {
  className: 'fade-from-bottom',
  values: { type: 'string' },
  transform(options: string) {
    return {
      opacity: 0,
      animation: `fadeFromBottom ${options} forwards`,
    };
  },
};

export const $fadeFromTop: PropertyConfig = {
  className: 'fade-from-top',
  values: { type: 'string' },
  transform(options: string) {
    return {
      opacity: 0,
      animation: `fadeFromTop ${options} forwards`,
    };
  },
};
