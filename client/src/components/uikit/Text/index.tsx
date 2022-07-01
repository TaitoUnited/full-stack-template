import styled, { CSSProperties } from 'styled-components';
import type { HTMLAttributes } from 'react';
import type { Typography, Color } from '~constants/theme';

type Tags = keyof JSX.IntrinsicElements;

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant: Typography;
  color?: Color;
  align?: CSSProperties['textAlign'];
  lineHeight?: CSSProperties['lineHeight'];
  as?: Tags;
};

type TransientProps = {
  $variant: Props['variant'];
  $color?: Props['color'];
  $align?: Props['align'];
  $lineHeight?: Props['lineHeight'];
};

export default function Text({
  color,
  variant,
  align,
  lineHeight,
  as: asTag,
  children,
  ...rest
}: Props) {
  const tag = asTag || variantToTag[variant];

  return (
    <TextBase
      {...rest}
      as={tag}
      $variant={variant}
      $color={color}
      $align={align}
      $lineHeight={lineHeight}
    >
      {children}
    </TextBase>
  );
}

const variantToTag: { [key in Typography]: Partial<Tags> } = {
  title1: 'h1',
  title2: 'h2',
  title3: 'h3',
  title4: 'h4',
  overline: 'span',
  caption: 'span',
  body: 'span',
  bodyStrong: 'strong',
  bodySmall: 'span',
  bodySmallStrong: 'strong',
  bodyLarge: 'span',
  bodyLargeStrong: 'strong',
};

const TextBase = styled.span<TransientProps>`
  ${p => p.theme.typography[p.$variant]}
  margin: 0;
  max-width: 100%;
  color: ${p => p.theme.colors[p.$color || 'text']};
  line-height: ${p => (p.$lineHeight !== undefined ? p.$lineHeight : 1)};
  text-align: ${p => p.$align || 'left'};
`;
