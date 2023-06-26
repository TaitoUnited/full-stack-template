import { forwardRef, useRef } from 'react';
import { mergeProps, useButton, useFocusRing } from 'react-aria';
import { Link } from 'react-router-dom'; // eslint-disable-line no-restricted-imports
import mergeRefs from 'react-merge-refs';
import styled from 'styled-components';

import Icon from '../Icon';
import Stack from '../Stack';
import Spinner from '../Spinner';
import type { ButtonProps, ButtonSize, ButtonVariant } from './types';
import type { Theme, Typography } from '~constants/theme';
import { hoverHighlight } from '~utils/styled';
import { useLinkProps } from '~components/navigation/Link';

type Props = ButtonProps & {
  // NOTE: we need to get the custom styles via a prop instead of extending since that will break stuff
  customStyles: any;
};

const ButtonContent = forwardRef<HTMLButtonElement, Props>(
  (
    {
      asLink,
      children,
      customStyles,
      disabled = false,
      icon,
      iconPlacement = 'right',
      id,
      loading = false,
      onClick,
      size = 'normal',
      type = 'button',
      variant,
      ...rest
    },
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const { isFocusVisible, focusProps } = useFocusRing();

    const { buttonProps, isPressed } = useButton(
      {
        id,
        type,
        children,
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
        icon={icon}
        color="currentColor"
        size={buttonSizeToIconSize[size]}
      />
    ) : null;

    return (
      <Wrapper
        {...rest}
        {...buttonProps}
        {...focusProps}
        ref={mergeRefs([localRef, ref])}
        as={asLink ? ButtonLink : undefined}
        linkProps={asLink}
        $size={size}
        $variant={variant}
        $customStyles={customStyles}
        $isPressed={isPressed}
        $isLoading={loading}
        $isFocusVisible={isFocusVisible}
      >
        <Stack axis="x" spacing="xsmall" align="center" justify="center">
          {iconPlacement === 'left' && iconComp}
          <span>{children}</span>
          {iconPlacement === 'right' && iconComp}
        </Stack>
      </Wrapper>
    );
  }
);

// TODO: how do we type the props here?
function ButtonLink({ linkProps, ...rest }: any) {
  const extraProps = useLinkProps(linkProps);
  return <Link to={linkProps.to} {...mergeProps(extraProps, rest)} />;
}

const buttonSizeToIconSize: { [size in ButtonSize]: number } = {
  small: 12,
  normal: 18,
  large: 24,
};

const buttonSizeToTextVariant: { [size in ButtonSize]: Partial<Typography> } = {
  small: 'bodySmall',
  normal: 'body',
  large: 'bodyLarge',
};

const buttonSizeToSpinnerSize: { [size in ButtonSize]: string } = {
  small: 'small',
  normal: 'normal',
  large: 'medium',
};

const horizontalPadding: {
  [size in keyof Theme['sizing']['button']]: keyof Theme['spacing'];
} = {
  small: 'normal',
  normal: 'large',
  large: 'large',
};

type WrapperProps = {
  $customStyles: any;
  $isFocusVisible: boolean;
  $isLoading: boolean;
  $isPressed: boolean;
  $size: ButtonSize;
  $variant: ButtonVariant;
};

const Wrapper = styled.button<WrapperProps>`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0;
  border-radius: ${p => p.theme.radii.normal}px;
  opacity: ${p => (p.disabled && !p.$isLoading ? 0.5 : 1)};
  height: ${p => p.theme.sizing.button[p.$size]}px;
  padding-left: ${p => p.theme.spacing[horizontalPadding[p.$size]]}px;
  padding-right: ${p => p.theme.spacing[horizontalPadding[p.$size]]}px;
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  text-decoration: none;
  outline-offset: 2px;
  outline: ${p =>
    p.$isFocusVisible ? `2px solid ${p.theme.colors[p.$variant]}` : 'none'};

  &:active {
    opacity: ${p => (p.disabled && !p.$isLoading ? 0.5 : 0.8)};
  }

  ${hoverHighlight}
  ${p => p.theme.typography[buttonSizeToTextVariant[p.$size] as Typography]}
  ${p => p.$customStyles}
`;

ButtonContent.displayName = 'ButtonContent';

export default ButtonContent;
