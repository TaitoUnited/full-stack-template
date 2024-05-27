import { useFocusRing } from 'react-aria';
import { CSSProperties, ReactNode, forwardRef } from 'react';

import {
  Button as AriaButton,
  ButtonProps as AriaButtonProps,
} from 'react-aria-components';

import { Icon, IconName } from '../Icon';
import { Spinner, SpinnerSize } from '../Spinner';
import { useLinkProps } from '~components/navigation/Link';
import { RecipeVariantProps, cva, cx } from '~styled-system/css';
import { styled } from '~styled-system/jsx';
import { token } from '~styled-system/tokens';

type ButtonSize = 'small' | 'normal' | 'large';

type ButtonColor = 'primary' | 'success' | 'error';

type OwnProps = {
  asLink?: Parameters<typeof useLinkProps>[0];
  children: ReactNode;
  iconLeading?: IconName;
  iconTrailing?: IconName;
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
      iconLeading,
      iconTrailing,
      isLoading,
      isDisabled,
      size = 'normal',
      style,
      variant,
      ...rest
    },
    ref
  ) => {
    const { isFocusVisible, focusProps } = useFocusRing();

    const _className = cx(
      buttonStyle({ size, variant, isFocusVisible, isDisabled }),
      className
    );

    const _style = {
      ...style,
      '--color-muted': token.var(`$colors.${color}Muted`),
      '--color-text': token.var(`$colors.${color}Contrast`),
      '--color': token.var(`$colors.${color}`),
      /**
       * NOTE: We want to reduce the horizontal padding when there are icons.
       * Doing this with compound variants would be very verbose...
       */
      '--padding-leading-factor': iconLeading ? 0.6 : 1,
      '--padding-trailing-factor': iconTrailing ? 0.6 : 1,
    } as CSSProperties;

    return (
      <AriaButton
        {...rest}
        {...focusProps}
        ref={ref}
        style={_style}
        className={_className}
        isDisabled={isDisabled}
      >
        {iconLeading && (
          <Icon
            name={iconLeading}
            color="currentColor"
            size={buttonSizeToIconSize[size]}
          />
        )}

        <span>{children}</span>

        {iconTrailing && (
          <Icon
            name={iconTrailing}
            color="currentColor"
            size={buttonSizeToIconSize[size]}
          />
        )}

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
  normal: 20,
  large: 24,
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
    borderRadius: '$full',
    overflow: 'hidden',
    textDecoration: 'none',
    outlineOffset: '2px',
    cursor: 'pointer',
    transition: 'background 50ms linear, opacity 100ms linear',
    '&:active': {
      opacity: 0.8,
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
        '&:hover': {
          backgroundColor: 'var(--color-muted)',
        },
      },
      plain: {
        backgroundColor: 'transparent',
        color: 'var(--color-text)',
        '&:hover': {
          backgroundColor: 'var(--color-muted)',
        },
      },
    },
    size: {
      small: {
        minHeight: '$buttonHeightSmall',
        paddingLeft:
          'calc(token($spacing.regular) * var(--padding-leading-factor, 1))',
        paddingRight:
          'calc(token($spacing.regular) * var(--padding-trailing-factor, 1))',
        textStyle: '$bodySmallSemiBold',
        gap: '$xxs',
      },
      normal: {
        minHeight: '$buttonHeightNormal',
        paddingLeft:
          'calc(token($spacing.medium) * var(--padding-leading-factor, 1))',
        paddingRight:
          'calc(token($spacing.medium) * var(--padding-trailing-factor, 1))',
        textStyle: '$bodySemiBold',
        gap: '$xs',
      },
      large: {
        minHeight: '$buttonHeightLarge',
        paddingLeft:
          'calc(token($spacing.large) * var(--padding-leading-factor, 1))',
        paddingRight:
          'calc(token($spacing.large) * var(--padding-trailing-factor, 1))',
        textStyle: '$bodyLargeBold',
        gap: '$small',
      },
    },
    isFocusVisible: {
      true: {
        outline: '2px solid var(--color)',
      },
      false: {
        outline: 'none',
      },
    },
    isDisabled: {
      true: {
        cursor: 'not-allowed',
        color: '$textDisabled',
        '&:hover': {
          backgroundColor: '$neutral5',
        },
        '&:active': {
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
