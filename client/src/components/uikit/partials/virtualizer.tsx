import type { ReactNode } from 'react';
import { useMemo } from 'react';
import {
  Virtualizer as AriaVirtualizer,
  ListLayout,
} from 'react-aria-components';

import { BEST_GUESS_LISTBOX_ITEM_HEIGHT } from './common';

export function Virtualizer({
  children,
  enabled,
  estimatedRowHeight,
}: {
  children: ReactNode;
  enabled: boolean;
  estimatedRowHeight?: number;
}) {
  const layout = useMemo(() => {
    return new ListLayout({
      estimatedRowHeight: estimatedRowHeight || BEST_GUESS_LISTBOX_ITEM_HEIGHT,
    });
  }, []);

  if (!enabled) {
    return children;
  }

  return <AriaVirtualizer layout={layout}>{children}</AriaVirtualizer>;
}
