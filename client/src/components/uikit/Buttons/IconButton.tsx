import { ButtonHTMLAttributes, forwardRef, useRef } from 'react';
import { useButton } from 'react-aria';
import mergeRefs from 'react-merge-refs';

import ButtonLink from './ButtonLink';
import Tooltip from '../Tooltip';
import Icon, { IconName } from '../Icon';
import { useLinkProps } from '~components/navigation/Link';
import { css, cx } from '~styled-system/css';
import { StyledSystemToken } from '~utils/styled-system';
import { ColorToken } from '~styled-system/tokens';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
  size?: number;
  color?: StyledSystemToken<ColorToken>;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  asLink?: Parameters<typeof useLinkProps>[0];
  onClick?: () => any;
};

const IconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      onClick,
      label,
      disabled,
      icon,
      id,
      asLink,
      className,
      color = 'text',
      size = 24,
      tooltipPosition = 'bottom',
      ...rest
    },
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const { buttonProps } = useButton(
      {
        id,
        elementType: asLink ? 'a' : 'button',
        type: 'button',
        'aria-label': label,
        isDisabled: disabled,
        onPress: onClick,
      },
      localRef
    );

    const Element = asLink ? ButtonLink : 'button';
    const linkProps = asLink ? { linkProps: asLink } : {};

    return (
      <Tooltip title={label} position={tooltipPosition}>
        <Element
          {...rest}
          {...buttonProps}
          {...linkProps}
          ref={mergeRefs([localRef, ref])}
          className={cx(styles, className)}
        >
          <Icon name={icon} size={size} color={color} />
        </Element>
      </Tooltip>
    );
  }
);

const styles = css({
  $focusRing: '',
  $hoverHighlight: '',
  position: 'relative',
  margin: 0,
  borderRadius: '50%',
  textDecoration: 'none',
  cursor: 'pointer',
  padding: '$xsmall',
  '&:active': {
    opacity: 0.8,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

IconButton.displayName = 'IconButton';

export default IconButton;
