import { type RefObject, useEffect } from 'react';

import { useEffectEvent } from './useEffectEvent';

export function useResizeObserver(
  ref: RefObject<HTMLElement>,
  callback: (entry: ResizeObserverEntry) => void
) {
  const stableCallback = useEffectEvent(callback);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => stableCallback(entry));

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
}
