import {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
  forwardRef,
} from 'react';
import { Button as ReactAriaButton } from 'react-aria-components';
import { useFocusRing } from 'react-aria';
import Icon, { IconName } from '../Icon';
import { ButtonSize } from './types';
import Spinner, { SpinnerSize } from '../Spinner';
import { useLinkProps } from '~components/navigation/Link';
import { RecipeVariantProps, cva, cx } from '~styled-system/css';
import { Stack } from '~styled-system/jsx';
import { token } from '~styled-system/tokens';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asLink?: Parameters<typeof useLinkProps>[0];
  children: ReactNode;
  icon?: IconName;
  iconPlacement?: 'left' | 'right';
  color?: 'primary' | 'success' | 'error';
  loading?: boolean;
  onClick?: () => any;
} & RecipeVariantProps<typeof buttonStyle>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      className,
      style,
      size = 'normal',
      icon,
      iconPlacement,
      loading,
      onClick,
      color = 'primary',
      ...rest
    },
    ref
  ) => {
    const { isFocusVisible, focusProps } = useFocusRing();
    const _className = cx(
      buttonStyle({ size, variant, isFocusVisible }),
      className
    );

    const _style = {
      ...style,
      '--color-muted': token.var(`colors.$${color}Muted`),
      '--color-text': token.var(`colors.$${color}Text`),
      '--color': token.var(`colors.$${color}`),
    } as CSSProperties;

    const iconComp = loading ? (
      <Spinner
        color="currentColor"
        size={buttonSizeToSpinnerSize[size] as any}
      />
    ) : icon ? (
      <Icon
        name={icon}
        color="currentColor"
        size={buttonSizeToIconSize[size]}
      />
    ) : null;

    return (
      <ReactAriaButton
        {...rest}
        {...focusProps}
        value={rest.value?.toString()} // wtf
        ref={ref}
        style={_style}
        className={_className}
        onPress={onClick}
      >
        <Stack direction="row" gap="$xsmall" align="center" justify="center">
          {iconPlacement === 'left' && iconComp}
          <span>{children}</span>
          {iconPlacement === 'right' && iconComp}
        </Stack>
      </ReactAriaButton>
    );
  }
);

const buttonSizeToIconSize: { [size in ButtonSize]: number } = {
  small: 12,
  normal: 18,
  large: 24,
};

const buttonSizeToSpinnerSize: { [size in ButtonSize]: SpinnerSize } = {
  small: 'small',
  normal: 'normal',
  large: 'medium',
};

export const buttonStyle = cva({
  base: {
    $hoverHighlight: '',
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    borderRadius: '$full',
    textDecoration: 'none',
    outlineOffset: '2px',
    cursor: 'pointer',
    transition: 'background 50ms linear',
    '&:active': {
      opacity: 0.8,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      filled: {
        backgroundColor: 'var(--color)',
        color: 'white',
      },
      soft: {
        color: 'var(--color-text)',
        backgroundColor: 'var(--color-muted)',
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
        height: '$buttonHeightSmall',
        paddingLeft: '$normal',
        paddingRight: '$normal',
        textStyle: '$bodySmallBold',
      },
      normal: {
        height: '$buttonHeightNormal',
        paddingLeft: '$large',
        paddingRight: '$large',
        textStyle: '$bodyBold',
      },
      large: {
        height: '$buttonHeightLarge',
        paddingLeft: '$large',
        paddingRight: '$large',
        textStyle: '$bodyLargeBold',
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
  },
});

Button.displayName = 'Button';

export default Button;
