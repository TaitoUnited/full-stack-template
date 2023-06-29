import { memo, type CSSProperties, type HTMLAttributes } from 'react';
import type { Typography, Color } from '~constants/theme';
import { cx, cva } from '~styled-system/css';
import { token } from '~styled-system/tokens';

type AllowedElement =
  | 'span'
  | 'p'
  | 'strong'
  | 'b'
  | 'i'
  | 'em'
  | 'small'
  | 'sub'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5';

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant: Typography;
  color?: Color;
  align?: CSSProperties['textAlign'];
  lineHeight?: CSSProperties['lineHeight'];
  as?: AllowedElement;
};

function Text({
  as,
  align,
  children,
  className,
  lineHeight,
  variant,
  color = 'text',
  ...rest
}: Props) {
  const Element = as || variantToElement[variant];

  return (
    <Element
      {...rest}
      className={cx(styles({ variant }), className)}
      style={{
        lineHeight,
        textAlign: align,
        color: token.var(`colors.${color}`),
      }}
    >
      {children}
    </Element>
  );
}

const variantToElement: { [key in Typography]: Partial<AllowedElement> } = {
  largeTitle: 'h1',
  title1: 'h1',
  title2: 'h2',
  title3: 'h3',
  subtitle: 'strong',
  overline: 'span',
  caption: 'span',
  body: 'span',
  bodyBold: 'strong',
  bodySmall: 'span',
  bodySmallBold: 'strong',
  bodyLarge: 'span',
  bodyLargeBold: 'strong',
};

const styles = cva({
  base: {
    margin: '0px',
    maxWidth: '100%',
  },
  variants: {
    variant: {
      largeTitle: { textStyle: 'largeTitle' },
      title1: { textStyle: 'title1' },
      title2: { textStyle: 'title2' },
      title3: { textStyle: 'title3' },
      subtitle: { textStyle: 'subtitle' },
      overline: { textStyle: 'overline' },
      caption: { textStyle: 'caption' },
      body: { textStyle: 'body' },
      bodyBold: { textStyle: 'bodyBold' },
      bodySmall: { textStyle: 'bodySmall' },
      bodySmallBold: { textStyle: 'bodySmallBold' },
      bodyLarge: { textStyle: 'bodyLarge' },
      bodyLargeBold: { textStyle: 'bodyLargeBold' },
    },
  },
});

export default memo(Text);
