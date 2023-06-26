import { ButtonHTMLAttributes, forwardRef, useRef } from 'react';
import { useButton, useFocusRing } from 'react-aria';
import styled from 'styled-components';
import mergeRefs from 'react-merge-refs';
import type { IconType } from 'react-icons';

import ButtonLink from './ButtonLink';
import Tooltip from '../Tooltip';
import Spinner from '../Spinner';
import Icon from '../Icon';
import { hoverHighlight } from '~utils/styled';
import { useLinkProps } from '~components/navigation/Link';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean;
  icon: IconType;
  label: string;
  loading?: boolean;
  onClick?: () => any;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  variant: 'primary' | 'info';
  asLink?: Parameters<typeof useLinkProps>[0];
};

const FloatingButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      onClick,
      label,
      disabled,
      loading,
      icon,
      id,
      asLink,
      tooltipPosition = 'left',
      variant,
      ...rest
    },
    ref: any
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const { isFocusVisible, focusProps } = useFocusRing();
    const { buttonProps, isPressed } = useButton(
      {
        id,
        elementType: asLink ? 'a' : 'button',
        type: 'button',
        'aria-label': label,
        isDisabled: disabled || loading,
        onPress: onClick,
      },
      localRef
    );

    const content = loading ? (
      <Spinner color="currentColor" size="normal" />
    ) : icon ? (
      <Icon icon={icon} size={24} color="currentColor" />
    ) : null;

    return (
      <Tooltip title={label} position={tooltipPosition}>
        <Wrapper
          type="button"
          {...rest}
          {...buttonProps}
          {...focusProps}
          ref={mergeRefs([localRef, ref])}
          as={asLink ? ButtonLink : undefined}
          linkProps={asLink}
          $variant={variant}
          $isLoading={loading}
          $isPressed={isPressed}
          $isFocusVisible={isFocusVisible}
        >
          {content}
        </Wrapper>
      </Tooltip>
    );
  }
);

type WrapperProps = {
  $variant: Props['variant'];
  $isPressed: boolean;
  $isLoading: boolean;
  $isFocusVisible: boolean;
  disabled: boolean;
};

const Wrapper = styled.button<WrapperProps>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${p => p.theme.sizing.button.large}px;
  height: ${p => p.theme.sizing.button.large}px;
  border-radius: 50%;
  background-color: ${p => p.theme.colors[p.$variant]};
  color: #fff;
  opacity: ${p => (p.disabled ? 0.5 : 1)};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  text-decoration: none;
  ${p => p.theme.shadows.large};

  &:active {
    opacity: ${p => (p.disabled && !p.$isLoading ? 0.5 : 0.8)};
  }

  ${hoverHighlight}

  /* Focus ring */
  &:before {
    content: '';
    pointer-events: none;
    opacity: ${p => (p.$isFocusVisible ? 1 : 0)};
    position: absolute;
    top: -4px;
    right: -4px;
    bottom: -4px;
    left: -4px;
    background: transparent;
    transition: opacity 50ms ease-in;
    border-radius: 999px;
    border: 2px solid ${p => p.theme.colors.primary};
  }
`;

FloatingButton.displayName = 'FloatingButton';

export default FloatingButton;
