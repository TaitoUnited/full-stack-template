import styled, { css } from 'styled-components';

import { getImportant, parseProps, getResponsiveCSS } from '../utils';

import type {
  WithResponsiveProps,
  WithTransientMediaProp,
  StyledTheme,
  BaseProps,
} from '../types';

type OwnProps = {
  axis?: 'x' | 'y';
  size: keyof StyledTheme['spacing'];
};

type Props = BaseProps & WithResponsiveProps<OwnProps>;

type TransientProps = WithTransientMediaProp<{
  $axis?: OwnProps['axis'];
  $size: OwnProps['size'];
}>;

type ThemedProps = TransientProps & { theme: StyledTheme };

const ownProps = ['axis', 'size'];

const hspacer = (p: ThemedProps, i: string) => css`
  width: ${getSpacing(p)};
  height: 0 ${i};
`;

const vspacer = (p: ThemedProps, i: string) => css`
  height: ${getSpacing(p)} ${i};
  width: 0 ${i};
`;

const getSpacing = (p: ThemedProps) => `${p.theme.spacing[p.$size]}px`;

const getCSS = (p: ThemedProps, important = false) => {
  const i = getImportant(important);
  if (p.$axis === 'x') return hspacer(p, i);
  if (!p.$axis || p.$axis === 'y') return vspacer(p, i);
  return '';
};

const SpacerBase = styled.div.attrs({ 'data-spacer': 'true' })<TransientProps>`
  flex-shrink: 0;
  ${getCSS}
  ${p => getResponsiveCSS(p, getCSS)}
`;

// eslint-disable-next-line
export default function Spacer({ children, ...props }: Props) {
  return <SpacerBase {...parseProps(props, ownProps)} />;
}
