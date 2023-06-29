import { SVGAttributes, memo } from 'react';
import { token, ColorToken } from '~styled-system/tokens';
import { ids } from '~design-system/icon-sprite-ids';

export type IconName = (typeof ids)[number];

type Props = SVGAttributes<any> & {
  name: IconName;
  color: ColorToken | 'currentColor';
  size: number;
};

function Icon({ name, size, color, style, ...rest }: Props) {
  return (
    <svg
      style={{
        ...style,
        width: size,
        height: size,
        color:
          color === 'currentColor'
            ? 'currentColor'
            : token.var(`colors.${color}`),
      }}
      {...rest}
      aria-hidden
    >
      <use href={`/icon-sprite.svg#${name}`} />
    </svg>
  );
}

export default memo(Icon);
