import { CSSProperties, forwardRef, useRef } from 'react';
import { useButton, useFocusRing } from 'react-aria';
import mergeRefs from 'react-merge-refs';

import type { ButtonProps, ButtonSize } from './types';
import Spinner, { SpinnerSize } from '../Spinner';
import ButtonLink from './ButtonLink';
import Icon from '../Icon';
import { Stack } from '~styled-system/jsx';
import { cva, cx } from '~styled-system/css';
import { token } from '~styled-system/tokens';

const ButtonContent = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asLink,
      children,
      disabled = false,
      icon,
      iconPlacement = 'right',
      id,
      loading = false,
      onClick,
      size = 'normal',
      type = 'button',
      variant,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const { isFocusVisible, focusProps } = useFocusRing();

    const { buttonProps } = useButton(
      {
        id,
        type,
        elementType: asLink ? 'a' : 'button',
        isDisabled: disabled || loading,
        onPress: onClick,
      },
      localRef
    );

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

    const _className = cx(
      styles({ size, isFocusVisible }),
      className
    );

    const _style = {
      ...style,
      '--outline-color': token.var(`colors.$${variant}`),
    } as CSSProperties;

    const Element = asLink ? ButtonLink : 'button';
    const linkProps = asLink ? { linkProps: asLink } : {};

    return (
      <Element
        {...rest}
        {...buttonProps}
        {...focusProps}
        {...linkProps}
        ref={mergeRefs([localRef, ref])}
        className={_className}
        style={_style}
      >
        <Stack direction="row" gap="$xsmall" align="center" justify="center">
          {iconPlacement === 'left' && iconComp}
          <span>{children}</span>
          {iconPlacement === 'right' && iconComp}
        </Stack>
      </Element>
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

const styles = cva({
  base: {
    $hoverHighlight: '',
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    borderRadius: '$normal',
    textDecoration: 'none',
    outlineOffset: '2px',
    cursor: 'pointer',
    '&:active': {
      opacity: 0.8,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    size: {
      small: {
        height: '$buttonHeightSmall',
        paddingLeft: '$normal',
        paddingRight: '$normal',
        textStyle: '$bodySmall',
      },
      normal: {
        height: '$buttonHeightNormal',
        paddingLeft: '$large',
        paddingRight: '$large',
        textStyle: '$body',
      },
      large: {
        height: '$buttonHeightLarge',
        paddingLeft: '$large',
        paddingRight: '$large',
        textStyle: '$bodyLarge',
      },
    },
    isFocusVisible: {
      true: {
        outline: '2px solid var(--outline-color)',
      },
      false: {
        outline: 'none',
      },
    },
  },
});

ButtonContent.displayName = 'ButtonContent';

export default ButtonContent;
