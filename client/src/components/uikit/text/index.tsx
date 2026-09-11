import { type CSSProperties, type HTMLAttributes } from 'react';

import { type Typography } from '~/design-tokens/types';
import { cva, cx } from '~/design-system/css';
import { text } from '~/design-system/patterns';
import { type ColorToken, token } from '~/design-system/tokens';
import { type DesignSystemToken } from '~/utils/design-system';

import {
  getResponsiveBaseValue,
  type ResponsiveProp,
} from '../../../design-system/responsive';

type AllowedElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'b'
  | 'em'
  | 'i'
  | 'p'
  | 'small'
  | 'span'
  | 'strong'
  | 'sub';

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant: ResponsiveProp<Typography>;
  color?: DesignSystemToken<ColorToken> | 'currentColor';
  align?: CSSProperties['textAlign'];
  lineHeight?: CSSProperties['lineHeight'];
  as?: AllowedElement;
  tabularNumeric?: boolean;
  truncate?: boolean;
};

export function Text({
  as,
  align,
  children,
  className,
  lineHeight,
  variant,
  style,
  color = 'text',
  tabularNumeric,
  truncate,
  ...rest
}: Props) {
  const baseVariant = getResponsiveBaseValue(variant);
  const Element = as ?? variantToElement[baseVariant];

  const colorStyle =
    color === 'currentColor' ? 'currentColor' : token.var(`colors.$${color}`);

  return (
    <Element
      {...rest}
      className={cx(text({ variant }), styles({ truncate }), className)}
      style={{
        ...style,
        lineHeight,
        textAlign: align,
        color: colorStyle,
        fontVariantNumeric: tabularNumeric ? 'tabular-nums' : undefined,
      }}
    >
      {children}
    </Element>
  );
}

const variantToElement: { [key in Typography]: Partial<AllowedElement> } = {
  body: 'span',
  bodyBold: 'strong',
  bodyExtraSmall: 'span',
  bodyExtraSmallBold: 'strong',
  bodyLarge: 'span',
  bodyLargeBold: 'strong',
  bodySemiBold: 'strong',
  bodySmall: 'span',
  bodySmallBold: 'strong',
  bodySmallSemiBold: 'strong',
  displayExtraSmall: 'span',
  displayLarge: 'span',
  displaySmall: 'span',
  headingL: 'h2',
  headingM: 'h3',
  headingS: 'h4',
  headingXl: 'h1',
  headingXxl: 'h1',
  label: 'span',
  lead: 'span',
  leadBold: 'strong',
  linkText: 'span',
  linkTextHover: 'span',
  overlineRegular: 'span',
  overlineSmall: 'span',
};

const styles = cva({
  base: {
    margin: '0px',
    maxWidth: '100%',
    // Don't let text line height contribute to the whitespace.
    lineHeight: 1,
    // Trim extra whitespace from the top and bottom of the text box
    textBoxTrim: 'trim-both',
    textBoxEdge: 'cap alphabetic',
  },
  variants: {
    truncate: {
      true: {
        $truncate: true,
        // Truncation doesn't play nice with text box trimming
        textBoxTrim: '!none',
      },
    },
  },
});
