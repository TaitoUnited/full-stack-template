import { forwardRef, useMemo } from 'react';
import { css } from 'styled-components';

import type { ButtonProps } from './types';
import ButtonContent from './ButtonContent';

const FillButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant, ...rest }, ref) => {
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
  background-color: ${p => p.theme.colors[variant]};
  color: white;

  /* Add 1px to make button same size as outline button */
  > div {
    padding: 1px;
  }
`;

FillButton.displayName = 'FillButton';

export default FillButton;
