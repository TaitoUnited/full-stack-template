import { type CSSProperties } from 'react';

import './styles.css';

import { type SpacingToken } from '~design-tokens/spacing';
import { type ColorsToken } from '~design-tokens/colors';
import { type RadiiToken } from '~design-tokens/radii';
import { styled } from '~styled-system/jsx';
import { token } from '~styled-system/tokens';

type Props = {
  marginTop?: SpacingToken | number;
  marginRight?: SpacingToken | number;
  marginBottom?: SpacingToken | number;
  marginLeft?: SpacingToken | number;
  width?: SpacingToken | CSSProperties['width'];
  height?: SpacingToken | CSSProperties['height'];
  style?: CSSProperties;
  borderRadius?: RadiiToken | number;
  backgroundColor?: ColorsToken;
};

export default function SkeletonPlaceholder({
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
        marginTop: typeof marginTop === 'string' ? token.var(`spacing.$${marginTop}`) : marginTop, // prettier-ignore
        marginRight: typeof marginRight === 'string' ? token.var(`spacing.$${marginRight}`) : marginRight, // prettier-ignore
        marginBottom: typeof marginBottom === 'string' ? token.var(`spacing.$${marginBottom}`) : marginBottom, // prettier-ignore
        marginLeft: typeof marginLeft === 'string' ? token.var(`spacing.$${marginLeft}`) : marginLeft, // prettier-ignore
        borderRadius: typeof borderRadius === 'string' ? token.var(`radii.$${borderRadius}`) : borderRadius, // prettier-ignore
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
    backgroundColor: '$muted5',
    backgroundImage:
      'linear-gradient(to right, token(colors.$muted5) 0%, token(colors.$muted4) 20%, token(colors.$muted5) 40%, token(colors.$muted5) 100%)',
  },
});
