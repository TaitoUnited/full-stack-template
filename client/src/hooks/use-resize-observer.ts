import { type RefObject, useEffect } from 'react';

import { useEffectEvent } from './use-effect-event';

export function useResizeObserver({
  ref,
  enabled = true,
  handler,
}: {
  ref: RefObject<HTMLElement | null>;
  enabled?: boolean;
  handler: (entry: ResizeObserverEntry) => void;
}) {
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) return;

    const observer = new ResizeObserver(([entry]) => stableHandler(entry));

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [enabled]);
}
