import { SVGAttributes, memo } from 'react';
import { token, ColorToken } from '~styled-system/tokens';
import { type ids } from '~design-tokens/icon-sprite-ids';
import { StyledSystemToken } from '~utils/styled-system';

export type IconName = (typeof ids)[number];

type Props = SVGAttributes<any> & {
  name: IconName;
  color: StyledSystemToken<ColorToken> | 'currentColor';
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
            : token.var(`colors.$${color}`),
      }}
      {...rest}
      aria-hidden
    >
      <use href={`/icon-sprite.svg#${name}`} />
    </svg>
  );
}

export default memo(Icon);
