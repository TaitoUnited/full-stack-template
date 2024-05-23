import { type CSSProperties } from 'react';

import './styles.css';

import { token } from '~styled-system/tokens';
import { styled } from '~styled-system/jsx';
import type { Color, Spacing, Radii } from '~design-tokens/types';

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
  style,
  width,
  height,
  marginTop: mt,
  marginRight: mr,
  marginBottom: mb,
  marginLeft: ml,
  borderRadius: br,
  ...rest
}: Props) {
  return (
    <Wrapper
      style={{
        width,
        height,
        marginTop: typeof mt === 'string' ? token.var(`$spacing.${mt}`) : mt,
        marginRight: typeof mr === 'string' ? token.var(`$spacing.${mr}`) : mr,
        marginBottom: typeof mb === 'string' ? token.var(`$spacing.${mb}`) : mb,
        marginLeft: typeof ml === 'string' ? token.var(`$spacing.${ml}`) : ml,
        borderRadius: typeof br === 'string' ? token.var(`$radii.${br}`) : br,
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
