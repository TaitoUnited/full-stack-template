import { type CSSProperties, type ReactNode, type Ref } from 'react';

import { cx } from '~/design-system/css';
import { stack } from '~/design-system/patterns';
import { type SpacingToken } from '~/design-system/tokens';
import { type DesignSystemToken } from '~/utils/design-system';

import { type ResponsiveProp } from '../../../design-system/responsive';

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
  gap: ResponsiveProp<DesignSystemToken<SpacingToken>>;
  direction?: ResponsiveProp<CSSProperties['flexDirection']>;
  align?: ResponsiveProp<CSSProperties['alignItems']>;
  justify?: ResponsiveProp<CSSProperties['justifyContent']>;
  wrap?: ResponsiveProp<CSSProperties['flexWrap']>;
  grow?: ResponsiveProp<CSSProperties['flexGrow']>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: AllowedElement;
};

export function Stack({
  as,
  children,
  className,
  style,
  gap,
  direction,
  align,
  justify,
  wrap,
  grow,
  ref,
  ...rest
}: Props) {
  const Element = as ?? 'div';

  return (
    <Element
      {...rest}
      ref={ref}
      className={cx(
        stack({ gap, direction, align, justify, wrap, grow }),
        className
      )}
      style={style}
    >
      {children}
    </Element>
  );
}
