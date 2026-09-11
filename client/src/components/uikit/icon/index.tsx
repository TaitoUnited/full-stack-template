import { memo, type SVGAttributes } from 'react';

import { type ids } from '~/design-tokens/icon-sprite-ids';
import { type ColorToken, token } from '~/design-system/tokens';
import { type DesignSystemToken } from '~/utils/design-system';

export type IconName = (typeof ids)[number];

type Props = SVGAttributes<any> & {
  name: IconName;
  color: DesignSystemToken<ColorToken> | 'currentColor';
  size: number;
};

function IconBase({ name, size, color, style, ...rest }: Props) {
  return (
    <svg
      style={{
        ...style,
        width: size,
        height: size,
        flexShrink: 0,
        color:
          color === 'currentColor'
            ? 'currentColor'
            : token.var(`$colors.${color}`),
      }}
      {...rest}
      aria-hidden
    >
      <use href={`/icon-sprite.svg#${name}`} />
    </svg>
  );
}

export const Icon = memo(IconBase);
