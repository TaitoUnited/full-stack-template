import { type CSSProperties, memo, type ReactNode, type Ref } from 'react';

import { css } from '~/styled-system/css';
import {
  type BreakpointToken,
  type SpacingToken,
} from '~/styled-system/tokens';
import { type StyledSystemToken } from '~/utils/styled-system';

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

type Breakpoint = 'base' | StyledSystemToken<BreakpointToken>;
type ResponsiveValue<T> = T | { [key in Breakpoint]?: T };

type Props = {
  ref?: Ref<any>;
  gap: ResponsiveValue<SpacingToken>;
  direction?: ResponsiveValue<CSSProperties['flexDirection']>;
  align?: ResponsiveValue<CSSProperties['alignItems']>;
  justify?: ResponsiveValue<CSSProperties['justifyContent']>;
  wrap?: ResponsiveValue<CSSProperties['flexWrap']>;
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

  const className = css({
    gap,
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
  });

  return (
    <Element {...rest} ref={ref} className={className} style={style}>
      {children}
    </Element>
  );
}

export const Stack = memo(StackBase);
