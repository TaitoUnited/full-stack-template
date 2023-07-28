import { ButtonHTMLAttributes, CSSProperties, forwardRef, useRef } from 'react';
import { useButton, useFocusRing } from 'react-aria';
import mergeRefs from 'react-merge-refs';

import ButtonLink from './ButtonLink';
import Tooltip from '../Tooltip';
import Spinner from '../Spinner';
import Icon, { IconName } from '../Icon';
import { useLinkProps } from '~components/navigation/Link';
import { cva, cx } from '~styled-system/css';
import { token } from '~styled-system/tokens';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
  loading?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  variant: 'primary' | 'info';
  asLink?: Parameters<typeof useLinkProps>[0];
  onClick?: () => any;
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
      <Icon name={icon} size={24} color="currentColor" />
    ) : null;

    const _className = cx(styles({ isFocusVisible }), className);

    const _style = {
      ...style,
      color: token.var(`colors.$${variant}Text`),
      backgroundColor: token.var(`colors.$${variant}Muted`),
      '--outline-color': token.var(`colors.$${variant}`),
    } as CSSProperties;

    const Element = asLink ? ButtonLink : 'button';
    const linkProps = asLink ? { linkProps: asLink } : {};

    return (
      <Tooltip title={label} position={tooltipPosition}>
        <Element
          {...rest}
          {...buttonProps}
          {...focusProps}
          {...linkProps}
          ref={mergeRefs([localRef, ref])}
          className={_className}
          style={_style}
        >
          {content}
        </Element>
      </Tooltip>
    );
  }
);

const styles = cva({
  base: {
    $hoverHighlight: '',
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    borderRadius: '50%',
    textDecoration: 'none',
    outlineOffset: '2px',
    cursor: 'pointer',
    height: '$buttonHeightLarge',
    width: '$buttonHeightLarge',
    boxShadow: '$large',
    '&:active': {
      opacity: 0.8,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
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

FloatingButton.displayName = 'FloatingButton';

export default FloatingButton;
