import { type CSSProperties, memo, type ReactNode, type Ref } from 'react';

import { type SpacingToken, token } from '~styled-system/tokens';
import { type StyledSystemToken } from '~utils/styled-system';

type AllowedElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav'
  | 'ul'
  | 'ol'
  | 'li';

type Props = {
  ref?: Ref<any>;
  gap: StyledSystemToken<SpacingToken>;
  direction?: CSSProperties['flexDirection'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: AllowedElement;
};

function StackBase({
  as,
  children,
  style,
  gap,
  direction,
  align,
  justify,
  wrap,
  ref,
  ...rest
}: Props) {
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

export const Stack = memo(StackBase);
