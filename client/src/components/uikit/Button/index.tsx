import { CSSProperties, ReactNode, forwardRef } from 'react';

import {
  Button as AriaButton,
  ButtonProps as AriaButtonProps,
} from 'react-aria-components';

import { Icon, IconName } from '../Icon';
import { Spinner, SpinnerSize } from '../Spinner';
import { RecipeVariantProps, cva, cx } from '~styled-system/css';
import { styled } from '~styled-system/jsx';
import { token } from '~styled-system/tokens';

type ButtonSize = 'small' | 'normal' | 'large';

type ButtonColor = 'primary' | 'success' | 'error';

type OwnProps = {
  children: ReactNode;
  icon?: IconName;
  iconPlacement?: 'start' | 'end';
  color?: ButtonColor;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
};

type ButtonProps = AriaButtonProps &
  RecipeVariantProps<typeof buttonStyle> &
  OwnProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      color = 'primary',
      icon,
      iconPlacement = 'start',
      isLoading,
      isDisabled,
      size = 'normal',
      style,
      variant,
      ...rest
    },
    ref
  ) => {
    const _className = cx(
      buttonStyle({ size, variant, isDisabled }),
      className
    );

    const _style = {
      ...style,
      '--color-muted': token.var(`$colors.${color}Muted`),
      '--color-text': token.var(`$colors.${color}Contrast`),
      '--color': token.var(`$colors.${color}`),
      // Visually balance the horizontal padding when an icon is present.
      '--padding-start-factor': icon && iconPlacement === 'start' ? 0.75 : 1,
      '--padding-end-factor': icon && iconPlacement === 'end' ? 0.75 : 1,
    } as CSSProperties;

    const iconComp = icon && (
      <Icon
        name={icon}
        color="currentColor"
        size={buttonSizeToIconSize[size]}
      />
    );

    return (
      <AriaButton
        {...rest}
        ref={ref}
        style={_style}
        className={_className}
        isDisabled={isDisabled}
      >
        {icon && iconPlacement === 'start' && iconComp}
        <span>{children}</span>
        {icon && iconPlacement === 'end' && iconComp}
        {isLoading && (
          <SpinnerWrapper>
            <Spinner
              color="currentColor"
              size={buttonSizeToSpinnerSize[size]}
            />
          </SpinnerWrapper>
        )}
      </AriaButton>
    );
  }
);

const buttonSizeToIconSize: { [size in ButtonSize]: number } = {
  small: 14,
  normal: 18,
  large: 20,
};

const buttonSizeToSpinnerSize: { [size in ButtonSize]: SpinnerSize } = {
  small: 'small',
  normal: 'normal',
  large: 'medium',
};

export const buttonStyle = cva({
  base: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    paddingBlock: '$xs',
    borderRadius: '$full',
    overflow: 'hidden',
    textDecoration: 'none',
    outlineOffset: '2px',
    cursor: 'pointer',
    transition: 'background 50ms linear, opacity 100ms linear',
    userSelect: 'none',
    lineHeight: 1,
    outline: 'none',

    '&[data-pressed="true"]': {
      opacity: 0.8,
    },
    '&[data-focus-visible="true"]': {
      outline: '2px solid var(--color)',
    },
    '& svg': {
      flexShrink: 0,
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
    size: {
      small: {
        gap: '$xxs',
        textStyle: '$bodySmallSemiBold',
        minHeight: '$buttonHeightSmall',
        paddingLeft:
          'calc(token($spacing.small) * var(--padding-start-factor, 1))',
        paddingRight:
          'calc(token($spacing.small) * var(--padding-end-factor, 1))',
      },
      normal: {
        gap: '$xxs',
        textStyle: '$bodySemiBold',
        minHeight: '$buttonHeightMedium',
        paddingLeft:
          'calc(token($spacing.regular) * var(--padding-start-factor, 1))',
        paddingRight:
          'calc(token($spacing.regular) * var(--padding-end-factor, 1))',
      },
      large: {
        gap: '$xs',
        textStyle: '$bodyLargeBold',
        minHeight: '$buttonHeightLarge',
        paddingLeft:
          'calc(token($spacing.regular) * var(--padding-start-factor, 1))',
        paddingRight:
          'calc(token($spacing.regular) * var(--padding-end-factor, 1))',
      },
    },
    isDisabled: {
      true: {
        cursor: 'not-allowed',
        color: '$textDisabled',
        '&[data-hovered="true"]': {
          backgroundColor: '$neutral5',
        },
        '&[data-pressed="true"]': {
          opacity: 1,
        },
      },
    },
  },
  compoundVariants: [
    {
      isDisabled: true,
      variant: ['filled', 'soft'],
      css: { backgroundColor: '$neutral4' },
    },
    {
      isDisabled: true,
      variant: 'outlined',
      css: { borderColor: '$line2' },
    },
  ],
});

const SpinnerWrapper = styled('div', {
  base: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'inherit',
  },
});

Button.displayName = 'Button';
