import { useTheme } from 'styled-components';
import type { SVGAttributes } from 'react';
import type { IconType } from 'react-icons';

import type { Color } from '~constants/theme';

type Props = SVGAttributes<any> & {
  icon: IconType;
  color: Color | 'currentColor';
  size: number;
};

export default function Icon({
  icon: IconComponent,
  size,
  color,
  ...rest
}: Props) {
  const { colors } = useTheme();

  return (
    <IconComponent
      {...rest}
      color={color === 'currentColor' ? color : colors[color]}
      size={size}
    />
  );
}
