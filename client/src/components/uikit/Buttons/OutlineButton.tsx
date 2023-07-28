import { CSSProperties, forwardRef } from 'react';

import type { ButtonProps } from './types';
import ButtonContent from './ButtonContent';
import { css, cx } from '~styled-system/css';
import { token } from '~styled-system/tokens';

const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant, className, style, ...rest }, ref) => {
    const _style = {
      ...style,
      '--color': token.var(`colors.$${variant}`),
    } as CSSProperties;

    return (
      <ButtonContent
        {...rest}
        ref={ref}
        variant={variant}
        style={_style}
        className={cx(styles, className)}
      >
        {children}
      </ButtonContent>
    );
  }
);

const styles = css({
  backgroundColor: 'transparent',
  color: 'var(--color)',
  border: '1px solid var(--color)',
});

OutlineButton.displayName = 'OutlineButton';

export default OutlineButton;
