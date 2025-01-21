import { type CSSProperties, type Ref } from 'react';
import { Button, type ButtonProps } from 'react-aria-components';

import { cva, cx, type RecipeVariantProps } from '~styled-system/css';
import { token } from '~styled-system/tokens';

import { Icon, type IconName } from '../Icon';
import { Tooltip } from '../Tooltip';

type IconButtonSize = 'small' | 'medium' | 'large';

type IconButtonColor = 'primary' | 'success' | 'error' | 'neutral';

type OwnProps = {
  ref?: Ref<HTMLButtonElement>;
  icon: IconName;
  label: string;
  size?: IconButtonSize | number;
  color?: IconButtonColor;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
};

type Props = ButtonProps & RecipeVariantProps<typeof styles> & OwnProps;

const sizeEnumToNumber: { [size in IconButtonSize]: number } = {
  small: 32,
  medium: 36,
  large: 44,
};

export function IconButton({
  ref,
  label,
  icon,
  style,
  className,
  color = 'neutral',
  size = 'medium',
  variant = 'plain',
  tooltipPlacement = 'top',
  ...rest
}: Props) {
  let colorMuted: string;

  if (color === 'neutral') {
    colorMuted = token.var('$colors.neutral5');
  } else {
    colorMuted = token.var(`$colors.${color}Muted`);
  }

  let colorText: string;

  if (color === 'neutral') {
    colorText = token.var('$colors.text');
  } else {
    colorText = token.var(`$colors.${color}Contrast`);
  }

  let colorValue: string;

  if (color === 'neutral') {
    colorValue = token.var('$colors.neutral1');
  } else {
    colorValue = token.var(`$colors.${color}`);
  }

  const _className = cx(styles({ variant }), className);

  const _size = typeof size === 'number' ? size : sizeEnumToNumber[size];

  const _style = {
    ...style,
    width: _size,
    height: _size,
    '--color-muted': colorMuted,
    '--color-text': colorText,
    '--color': colorValue,
  } as CSSProperties;

  return (
    <Tooltip content={label} placement={tooltipPlacement}>
      <Button ref={ref} style={_style} className={_className} {...rest}>
        <Icon name={icon} size={_size * 0.6} color="currentColor" />
      </Button>
    </Tooltip>
  );
}

const styles = cva({
  base: {
    position: 'relative',
    margin: 0,
    borderRadius: '50%',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    outlineOffset: '2px',

    '&[data-pressed="true"]': {
      opacity: 0.8,
    },
    '&[data-disabled="true"]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&[data-focus-visible="true"]': {
      outline: '2px solid var(--color)',
    },
  },
  variants: {
    variant: {
      filled: {
        backgroundColor: 'var(--color)',
        color: 'white',
        $hoverHighlight: true,
      },
      soft: {
        color: 'var(--color-text)',
        backgroundColor: 'var(--color-muted)',
        $hoverHighlight: true,
      },
      outlined: {
        backgroundColor: 'transparent',
        color: 'var(--color-text)',
        borderColor: 'var(--color)',
        borderWidth: '1px',
        borderStyle: 'solid',
        '&[data-hovered="true"]': {
          backgroundColor: 'var(--color-muted)',
        },
      },
      plain: {
        backgroundColor: 'transparent',
        color: 'var(--color-text)',
        '&[data-hovered="true"]': {
          backgroundColor: 'var(--color-muted)',
        },
      },
    },
  },
});
