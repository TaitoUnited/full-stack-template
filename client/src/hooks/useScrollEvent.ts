import { type RefObject, useEffect } from 'react';

import { useEffectEvent } from './useEffectEvent';

/**
 * Hook to add a scroll event listener to an element and execute a callback
 * on every scroll event.
 */
export function useScrollEvent(
  ref: RefObject<HTMLElement>,
  callback: (event: Event) => void
) {
  const stableCallback = useEffectEvent(callback);

  // TODO: add throttling if needed
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('scroll', stableCallback);

    return () => {
      element.removeEventListener('scroll', stableCallback);
    };
  }, []);
}
