import { useEffect } from 'react';

import { useDebouncedHandler } from './useDebouncedHandler';

/**
 * A hook to listen to window resize events with a debounced callback.
 */
export function useWindowResizeEvent({
  handler,
  debounceMs,
}: {
  handler: (event: UIEvent) => void;
  debounceMs: number;
}) {
  const debouncedHandler = useDebouncedHandler<UIEvent>(handler, debounceMs);

  useEffect(() => {
    window.addEventListener('resize', debouncedHandler);
    return () => window.removeEventListener('resize', debouncedHandler);
  }, []);
}
