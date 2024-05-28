import { forwardRef } from 'react';
import { Button, ButtonProps } from 'react-aria-components';

import { Tooltip } from '../Tooltip';
import { Icon, IconName } from '../Icon';
import { css, cx } from '~styled-system/css';
import { StyledSystemToken } from '~utils/styled-system';
import { ColorToken } from '~styled-system/tokens';

type Props = ButtonProps & {
  icon: IconName;
  label: string;
  size?: number;
  color?: StyledSystemToken<ColorToken>;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      label,
      icon,
      className,
      color = 'text',
      size = 32,
      tooltipPlacement = 'top',
      ...rest
    },
    ref
  ) => {
    return (
      <Tooltip content={label} placement={tooltipPlacement}>
        <Button
          {...rest}
          ref={ref}
          className={cx(styles, className, css({ width: size, height: size }))}
        >
          <Icon name={icon} size={size * 0.75} color={color} />
        </Button>
      </Tooltip>
    );
  }
);

const styles = css({
  $focusRing: true,
  $hoverHighlight: true,
  position: 'relative',
  margin: 0,
  borderRadius: '50%',
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&:active': {
    opacity: 0.8,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

IconButton.displayName = 'IconButton';
