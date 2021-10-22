import { createContext, useContext, CSSProperties, ReactNode } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import type { Spacing, Radius, Color } from '~constants/theme';
import { fadeColor } from '~utils/fn';

type Props = {
  marginTop?: Spacing | number;
  marginRight?: Spacing | number;
  marginBottom?: Spacing | number;
  marginLeft?: Spacing | number;
  width?: Spacing | CSSProperties['width'];
  height?: Spacing | CSSProperties['height'];
  style?: CSSProperties;
  borderRadius?: Radius | number;
  backgroundColor?: Color;
};

type SkeletonPlaceholderContextValue = {
  backgroundColor: Color;
};

const BG_SIZE = 800; // this is just some arbitrary value that looks good

const SkeletonPlaceholderContext = createContext<SkeletonPlaceholderContextValue>({ backgroundColor: 'muted5' }); // prettier-ignore

export function SkeletonPlaceholderProvider({
  children,
  backgroundColor,
}: {
  children: ReactNode;
  backgroundColor: Color;
}) {
  return (
    <SkeletonPlaceholderContext.Provider value={{ backgroundColor }}>
      {children}
    </SkeletonPlaceholderContext.Provider>
  );
}

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
  const { spacing, radii } = useTheme();
  const { backgroundColor } = useContext(SkeletonPlaceholderContext);

  return (
    <Wrapper
      style={{
        width,
        height,
        marginTop: typeof marginTop === 'string' ? spacing[marginTop] : marginTop, // prettier-ignore
        marginRight: typeof marginRight === 'string' ? spacing[marginRight] : marginRight, // prettier-ignore
        marginBottom: typeof marginBottom === 'string' ? spacing[marginBottom] : marginBottom, // prettier-ignore
        marginLeft: typeof marginLeft === 'string' ? spacing[marginLeft] : marginLeft, // prettier-ignore
        borderRadius: typeof borderRadius === 'string' ? radii[borderRadius] : borderRadius, // prettier-ignore
        flexGrow: width ? 0 : 1,
        backgroundSize: `${BG_SIZE}px 100%`,
        ...style,
      }}
      {...rest}
      backgroundColor={rest.backgroundColor || backgroundColor}
    />
  );
}

const shimmerAnimation = keyframes`
  from {
    background-position: -${BG_SIZE}px 0;
  }
  to {
    background-position: ${BG_SIZE}px 0;
  }
`;

const Wrapper = styled.div<{ borderRadius?: Radius; backgroundColor: Color }>`
  flex-shrink: 0;
  animation: ${shimmerAnimation} 2s forwards infinite linear;
  background-repeat: no-repeat;
  background: linear-gradient(
    to right,
    ${p => fadeColor(p.theme.colors[p.backgroundColor], 0.5)} 8%,
    ${p => p.theme.colors[p.backgroundColor]} 18%,
    ${p => fadeColor(p.theme.colors[p.backgroundColor], 0.5)} 33%
  );
`;
