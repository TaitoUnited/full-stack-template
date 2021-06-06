import { forwardRef, useMemo } from 'react';
import { css } from 'styled-components';

import type { ButtonProps } from './types';
import ButtonContent from './ButtonContent';

const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant, ...rest }, ref: any) => {
    const customStyles = useMemo(() => styles(variant), [variant]);

    return (
      <ButtonContent
        {...rest}
        ref={ref}
        variant={variant}
        customStyles={customStyles}
      >
        {children}
      </ButtonContent>
    );
  }
);

const styles = (variant: ButtonProps['variant']) => css`
  background-color: transparent;
  color: ${p => p.theme.colors[variant]};
  border-color: ${p => p.theme.colors[variant]};
  border-style: solid;
  border-width: 1px;
`;

OutlineButton.displayName = 'OutlineButton';

export default OutlineButton;
