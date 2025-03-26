import type { ReactNode } from 'react';
import { useMemo } from 'react';
import {
  UNSTABLE_ListLayout,
  UNSTABLE_Virtualizer,
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
    return new UNSTABLE_ListLayout({
      estimatedRowHeight: estimatedRowHeight || BEST_GUESS_LISTBOX_ITEM_HEIGHT,
    });
  }, []);

  if (!enabled) {
    return children;
  }

  return (
    <UNSTABLE_Virtualizer layout={layout}>{children}</UNSTABLE_Virtualizer>
  );
}
