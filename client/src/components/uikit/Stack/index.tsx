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

const getCSS = (p: ThemedProps) => css`
  flex-direction: ${p.$axis === 'x' ? 'row' : 'column'};
  flex-wrap: ${p.$fluid ? 'wrap' : 'nowrap'};
  gap: ${p.theme.spacing[p.$spacing]}px;
  ${p.$align && `align-items: ${p.$align};`}
  ${p.$justify && `justify-content: ${p.$justify};`}
`;

const StackBase = styled.div<TransientProps>`
  display: flex;
  ${getCSS}
  ${p => getResponsiveCSS(p, getCSS)}
`;

export default function Stack({ children, ...props }: Props) {
  return <StackBase {...parseProps(props, ownProps)}>{children}</StackBase>;
}
