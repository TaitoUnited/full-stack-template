import styled from 'styled-components';
import type { SVGAttributes } from 'react';

import { ids } from '~design-system/icon-sprite-ids';
import type { Color } from '~constants/theme';

export type IconName = (typeof ids)[number];

type Props = SVGAttributes<any> & {
  name: IconName;
  color: Color | 'currentColor';
  size: number;
};

export default function Icon({ name, size, color, ...rest }: Props) {
  return (
    <Svg size={size} color={color} {...rest} aria-hidden>
      <use href={`/icon-sprite.svg#${name}`} />
    </Svg>
  );
}

const Svg = styled.svg<{ size: Props['size']; color: Props['color'] }>`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  color: ${p =>
    p.color === 'currentColor' ? 'currentColor' : p.theme.colors[p.color]};
`;
