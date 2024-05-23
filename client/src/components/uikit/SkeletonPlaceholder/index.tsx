import { type CSSProperties } from 'react';

import './styles.css';

import { token } from '~styled-system/tokens';
import { styled } from '~styled-system/jsx';
import { Color, Spacing, Radii } from '~design-tokens/types';

type Props = {
  marginTop?: Spacing | number;
  marginRight?: Spacing | number;
  marginBottom?: Spacing | number;
  marginLeft?: Spacing | number;
  width?: Spacing | CSSProperties['width'];
  height?: Spacing | CSSProperties['height'];
  style?: CSSProperties;
  borderRadius?: Radii | number;
  backgroundColor?: Color;
};

export function SkeletonPlaceholder({
  width,
  height,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  borderRadius,
  style,
  ...rest
}: Props) {
  return (
    <Wrapper
      style={{
        width,
        height,
        marginTop: typeof marginTop === 'string' ? token.var(`$spacing.${marginTop}`) : marginTop, // prettier-ignore
        marginRight: typeof marginRight === 'string' ? token.var(`$spacing.${marginRight}`) : marginRight, // prettier-ignore
        marginBottom: typeof marginBottom === 'string' ? token.var(`$spacing.${marginBottom}`) : marginBottom, // prettier-ignore
        marginLeft: typeof marginLeft === 'string' ? token.var(`$spacing.${marginLeft}`) : marginLeft, // prettier-ignore
        borderRadius: typeof borderRadius === 'string' ? token.var(`$radii.${borderRadius}`) : borderRadius, // prettier-ignore
        flexGrow: width ? 0 : 1,
        ...style,
      }}
      {...rest}
    />
  );
}

const Wrapper = styled('div', {
  base: {
    flexShrink: 0,
    animation: 'skeletonPlaceholderShimmer 2s forwards infinite linear',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '800px 100%',
    backgroundColor: '$neutral5',
    backgroundImage:
      'linear-gradient(to right, token($colors.neutral5) 0%, token($colors.neutral4) 20%, token($colors.neutral5) 40%, token($colors.neutral5) 100%)',
  },
});
