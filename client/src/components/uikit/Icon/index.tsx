import { useTheme } from 'styled-components';
import type { SVGAttributes } from 'react';
import type { IconType } from 'react-icons';

import type { Color } from '~constants/theme';

type Props = SVGAttributes<any> & {
  icon: IconType;
  color: Color | 'currentColor';
  size: 'small' | 'normal' | 'large' | number;
};

export default function Icon({
  icon: IconComponent,
  size,
  color,
  ...rest
}: Props) {
  const { sizing, colors } = useTheme();
  const _size = typeof size === 'string' ? sizing.icon[size] : size;

  return (
    <IconComponent
      {...rest}
      color={color === 'currentColor' ? color : colors[color]}
      size={_size}
    />
  );
}
