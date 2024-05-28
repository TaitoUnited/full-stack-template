import { CSSProperties, ReactNode } from 'react';

import { SpacingToken, token } from '~styled-system/tokens';
import { polymorphicForwardRef } from '~utils/polymorphic';
import { StyledSystemToken } from '~utils/styled-system';

type OwnProps = {
  gap: StyledSystemToken<SpacingToken>;
  direction?: CSSProperties['flexDirection'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const Stack = polymorphicForwardRef<'div', OwnProps>(
  (
    { as, children, style, gap, direction, align, justify, wrap, ...rest },
    ref
  ) => {
    const Element = as || 'div';

    return (
      <Element
        {...rest}
        ref={ref}
        style={{
          gap: token.var(`$spacing.${gap}`),
          display: 'flex',
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap,
          ...style,
        }}
      >
        {children}
      </Element>
    );
  }
);

Stack.displayName = 'Stack';
