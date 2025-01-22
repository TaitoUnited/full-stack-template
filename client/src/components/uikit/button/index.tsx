import { type LinkProps } from '@tanstack/react-router';
import { type CSSProperties, memo, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';

import { Link } from '~/components/navigation/link';
import { cva, cx, type RecipeVariantProps } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { token } from '~/styled-system/tokens';

import { Icon, type IconName } from '../icon';
import { Spinner, type SpinnerSize } from '../spinner';

type ButtonSize = 'small' | 'normal' | 'large';

type ButtonColor = 'primary' | 'success' | 'error';

type ButtonIconPlacement = 'start' | 'end';

type OwnProps = RecipeVariantProps<typeof buttonStyle> & {
  children: ReactNode;
  icon?: IconName;
  iconPlacement?: ButtonIconPlacement;
  color?: ButtonColor;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

type ButtonProps = AriaButtonProps &
  OwnProps & {
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({
  ref,
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
}: ButtonProps) {
  const _style = {
    ...style,
    ...getButtonStyles({ color, icon, iconPlacement }),
  };

  const _className = cx(buttonStyle({ size, variant, isDisabled }), className);

  return (
    <AriaButton
      {...rest}
      ref={ref}
      style={_style}
      className={_className}
      isDisabled={isDisabled}
      // Disable the onPress but don't apply disable styles to the button
      onPress={isLoading ? undefined : rest.onPress}
    >
      <ButtonContent
        icon={icon}
        iconPlacement={iconPlacement}
        isLoading={isLoading}
        size={size}
      >
        {children}
      </ButtonContent>
    </AriaButton>
  );
}

// TODO: Discriminating union type for externalTo | to ?
type LinkButtonProps = LinkProps &
  OwnProps & {
    /**
     * "externalTo" can be used to link outside of the app, which "to" doesn't allow
     */
    externalTo?: string;
    rel?: string;
    ref?: Ref<HTMLAnchorElement>;
  };

function LinkButtonBase({
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
  externalTo,
  to,
  ref,
  ...rest
}: LinkButtonProps) {
  const _style = {
    ...style,
    ...getButtonStyles({ color, icon, iconPlacement }),
  };

  const _className = cx(buttonStyle({ size, variant, isDisabled }), className);

  const buttonContent = (
    <ButtonContent
      icon={icon}
      iconPlacement={iconPlacement}
      isLoading={isLoading}
      size={size}
    >
      {children}
    </ButtonContent>
  );

  if (externalTo) {
    return (
      <a
        ref={ref}
        href={externalTo}
        style={_style}
        className={_className}
        {...rest}
      >
        {buttonContent}
      </a>
    );
  }

  // TODO: figure out how to fix the type mismatch issue
  return (
    <Link
      ref={ref}
      to={to}
      style={_style}
      className={_className}
      {...(rest as any)}
    >
      {buttonContent}
    </Link>
  );
}

// Memo `LinkButton` as it most often has primitive props that don't change
export const LinkButton = memo(LinkButtonBase);

function getButtonStyles({
  color,
  icon,
  iconPlacement,
}: {
  color: ButtonColor;
  icon?: IconName;
  iconPlacement: ButtonIconPlacement;
}) {
  return {
    '--color-muted': token.var(`$colors.${color}Muted`),
    '--color-text': token.var(`$colors.${color}Contrast`),
    '--color': token.var(`$colors.${color}`),
    // Visually balance the horizontal padding when an icon is present.
    '--padding-start-factor': icon && iconPlacement === 'start' ? 0.75 : 1,
    '--padding-end-factor': icon && iconPlacement === 'end' ? 0.75 : 1,
  } as CSSProperties;
}

function ButtonContent({
  children,
  isLoading,
  icon,
  iconPlacement,
  size,
}: {
  children: ReactNode;
  isLoading?: boolean;
  icon?: IconName;
  iconPlacement: ButtonIconPlacement;
  size: ButtonSize;
}) {
  const iconComp = icon && (
    <Icon name={icon} color="currentColor" size={buttonSizeToIconSize[size]} />
  );

  return (
    <>
      {icon && iconPlacement === 'start' && iconComp}
      <ButtonText>{children}</ButtonText>
      {icon && iconPlacement === 'end' && iconComp}
      {isLoading && (
        <SpinnerWrapper>
          <Spinner color="currentColor" size={buttonSizeToSpinnerSize[size]} />
        </SpinnerWrapper>
      )}
    </>
  );
}

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
    borderRadius: '$regular',
    overflow: 'hidden',
    textDecoration: 'none',
    outlineOffset: '2px',
    cursor: 'default',
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

const ButtonText = styled('span', {
  base: {
    transform: 'translateY(1px)', // vertically align
  },
});
