import { type RefObject, useEffect } from 'react';

import { useStableCallback } from './use-stable-callback';

export function useResizeObserver({
  ref,
  enabled = true,
  handler,
}: {
  ref: RefObject<HTMLElement | null>;
  enabled?: boolean;
  handler: (entry: ResizeObserverEntry) => void;
}) {
  const stableHandler = useStableCallback(handler);

  useEffect(() => {
    if (!enabled) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        stableHandler(entry);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [enabled]);
}
