import type { HTMLAttributes, ReactNode, Ref } from 'react';

import { css, cx } from '~/styled-system/css';

type Props = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<any>;
  children: ReactNode;
};

export function Card({ ref, className, children, ...rest }: Props) {
  return (
    <div {...rest} ref={ref} className={cx(cardStyles, className)}>
      {children}
    </div>
  );
}

export const cardStyles = css({
  '--shadow-color': '0deg 0% 75%',
  padding: '$regular',
  borderRadius: '$regular',
  backgroundColor: '$surface',
  outline: '1px solid rgba(0, 0, 0, 0.02)',
  boxShadow: `0px 1px 1.4px hsl(var(--shadow-color) / 0.11),
        0px 1.7px 2.3px -0.5px hsl(var(--shadow-color) / 0.22),
        0px 3.6px 4.9px -1px hsl(var(--shadow-color) / 0.33)`,
});
