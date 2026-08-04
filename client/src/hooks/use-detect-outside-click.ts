import { type RefObject, useEffect } from 'react';

import { useStableCallback } from './use-stable-callback';

/**
 * Detects if the user clicks outside of a DOM element.
 */
export function useDetectOutsideClick({
  ref,
  enabled = true,
  handler,
}: {
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];
  enabled?: boolean;
  handler: () => void;
}) {
  const stableHandler = useStableCallback(handler);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      const eventTarget = event.target;
      if (!(eventTarget instanceof Node)) return;

      let isOutside = true;

      if (Array.isArray(ref)) {
        ref.forEach(r => {
          if (r.current?.contains(eventTarget)) {
            isOutside = false;
          }
        });
      } else if (ref.current?.contains(eventTarget)) {
        isOutside = false;
      }

      if (isOutside) {
        event.stopPropagation();
        stableHandler();
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [enabled]);
}
