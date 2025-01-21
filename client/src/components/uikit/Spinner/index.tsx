import { type CSSProperties } from 'react';

import './styles.css';

import { styled } from '~styled-system/jsx';
import { type ColorToken, token } from '~styled-system/tokens';
import { type StyledSystemToken } from '~utils/styled-system';

export type SpinnerSize = 'small' | 'normal' | 'medium' | 'large';

type Props = {
  color: StyledSystemToken<ColorToken> | 'currentColor';
  size?: SpinnerSize;
  className?: string;
  style?: CSSProperties;
};

export function Spinner({ color, size, style, className }: Props) {
  return (
    <Root
      className={className}
      size={size}
      style={
        {
          ...style,
          '--border-size': '2px',
          color:
            color === 'currentColor'
              ? 'currentColor'
              : token.var(`$colors.${color}`),
        } as CSSProperties
      }
    />
  );
}

const Root = styled('div', {
  base: {
    position: 'relative',
    width: 'calc(var(--size) + var(--border-size))',
    height: 'calc(var(--size) + var(--border-size))',

    '&:before': {
      content: "''",
      borderRadius: '50%',
      border: 'var(--border-size) solid currentColor',
      opacity: 0.3,
      zIndex: -1,
      position: 'absolute',
      inset: 0,
    },

    '&:after': {
      content: "''",
      animation: 'spin 0.6s infinite linear',
      borderRadius: '50%',
      border: 'var(--border-size) solid currentColor',
      borderTopColor: 'transparent',
      zIndex: 1,
      position: 'absolute',
      inset: 0,
    },
  },
  variants: {
    size: {
      small: { '--size': '12px' },
      normal: { '--size': '16px' },
      medium: { '--size': '24px' },
      large: { '--size': '48px' },
    },
  },
  defaultVariants: {
    size: 'normal',
  },
});
