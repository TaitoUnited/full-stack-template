import type { HTMLAttributes, ReactNode } from 'react';

import { styled } from '~/styled-system/jsx';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function ScrollView({ children, ...rest }: Props) {
  return (
    <ScrollContainer data-testid="scroll-view">
      <Scroller {...rest}>{children}</Scroller>
    </ScrollContainer>
  );
}

const ScrollContainer = styled('div', {
  base: {
    flex: 1,
    position: 'relative',
  },
});

const Scroller = styled('div', {
  base: {
    position: 'absolute',
    inset: 0,
    overflowY: 'auto',
    $customScrollbar: true,
  },
});
