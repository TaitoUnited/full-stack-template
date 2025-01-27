import {
  type ComponentProps,
  type CSSProperties,
  type HTMLAttributes,
  memo,
} from 'react';
import { Text as AriaText } from 'react-aria-components';

import { type Typography } from '~/design-tokens/types';
import { cva, cx } from '~/styled-system/css';
import { type ColorToken, token } from '~/styled-system/tokens';
import { type StyledSystemToken } from '~/utils/styled-system';

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

type Props = HTMLAttributes<HTMLSpanElement> &
  ComponentProps<typeof AriaText> & {
    variant: Typography;
    color?: StyledSystemToken<ColorToken>;
    align?: CSSProperties['textAlign'];
    lineHeight?: CSSProperties['lineHeight'];
    as?: AllowedElement;
  };

function TextBase({
  as,
  align,
  children,
  className,
  lineHeight,
  variant,
  style,
  color = 'text',
  ...rest
}: Props) {
  const elementType = as || variantToElement[variant];

  return (
    <AriaText
      {...rest}
      elementType={elementType}
      className={cx(styles({ variant }), className)}
      style={{
        ...style,
        lineHeight,
        textAlign: align,
        color: token.var(`$colors.${color}`),
      }}
    >
      {children}
    </AriaText>
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
  },
  variants: {
    variant: {
      body: { textStyle: '$body' },
      bodyBold: { textStyle: '$bodyBold' },
      bodyExtraSmall: { textStyle: '$bodyExtraSmall' },
      bodyExtraSmallBold: { textStyle: '$bodyExtraSmallBold' },
      bodyLarge: { textStyle: '$bodyLarge' },
      bodyLargeBold: { textStyle: '$bodyLargeBold' },
      bodySemiBold: { textStyle: '$bodySemiBold' },
      bodySmall: { textStyle: '$bodySmall' },
      bodySmallBold: { textStyle: '$bodySmallBold' },
      bodySmallSemiBold: { textStyle: '$bodySmallSemiBold' },
      displayExtraSmall: { textStyle: '$displayExtraSmall' },
      displayLarge: { textStyle: '$displayLarge' },
      displaySmall: { textStyle: '$displaySmall' },
      headingL: { textStyle: '$headingL' },
      headingM: { textStyle: '$headingM' },
      headingS: { textStyle: '$headingS' },
      headingXl: { textStyle: '$headingXl' },
      headingXxl: { textStyle: '$headingXxl' },
      label: { textStyle: '$label' },
      lead: { textStyle: '$lead' },
      leadBold: { textStyle: '$leadBold' },
      linkText: { textStyle: '$linkText' },
      linkTextHover: { textStyle: '$linkTextHover' },
      overlineRegular: { textStyle: '$overlineRegular' },
      overlineSmall: { textStyle: '$overlineSmall' },
    },
  },
});

export const Text = memo(TextBase);
