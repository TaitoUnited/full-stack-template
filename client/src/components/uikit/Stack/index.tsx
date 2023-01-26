import type { HTMLAttributes } from 'react';
import styled, { css, CSSProperties } from 'styled-components';
import { parseProps, getResponsiveCSS } from '../utils';

import type {
  WithResponsiveProps,
  WithTransientMediaProp,
  StyledTheme,
  BaseProps,
} from '../types';

type OwnProps = {
  spacing: keyof StyledTheme['spacing'];
  axis?: 'x' | 'y';
  fluid?: boolean;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
};

type Props = HTMLAttributes<HTMLDivElement> &
  BaseProps &
  WithResponsiveProps<OwnProps>;

type TransientProps = WithTransientMediaProp<{
  $spacing: OwnProps['spacing'];
  $axis?: OwnProps['axis'];
  $fluid?: OwnProps['fluid'];
  $align?: OwnProps['align'];
  $justify?: OwnProps['justify'];
}>;

type ThemedProps = TransientProps & { theme: StyledTheme };

const ownProps = ['axis', 'spacing', 'fluid', 'align', 'justify'];

const vstack = (p: ThemedProps) => css`
  flex-direction: column;
  gap: ${getSpacing(p)};
`;

const fluid = (p: ThemedProps) => css`
  flex-wrap: wrap;
  gap: ${getSpacing(p)};
  margin: calc(${getSpacing(p)} / 2 * -1);
`;

const hstack = (p: ThemedProps) => css`
  flex-direction: row;
  gap: ${getSpacing(p)};
  ${p.$fluid && fluid(p)}
`;

const getSpacing = (p: ThemedProps) => `${p.theme.spacing[p.$spacing]}px`;

const getCSS = (p: ThemedProps) => [
  p.$align && `align-items: ${p.$align};`,
  p.$justify && `justify-content: ${p.$justify};`,
  p.$axis === 'x' && hstack(p),
  (!p.$axis || p.$axis === 'y') && vstack(p),
];

const StackBase = styled.div<TransientProps>`
  display: flex;
  ${getCSS}
  ${p => getResponsiveCSS(p, getCSS)}
`;

export default function Stack({ children, ...props }: Props) {
  return <StackBase {...parseProps(props, ownProps)}>{children}</StackBase>;
}
