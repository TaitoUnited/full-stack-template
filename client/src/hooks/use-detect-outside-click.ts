import { type RefObject, useEffect } from 'react';

import { useEffectEvent } from './use-effect-event';

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
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: any) {
      let isOutside = true;

      if (Array.isArray(ref)) {
        ref.forEach(r => {
          if (r.current && r.current.contains(event.target)) {
            isOutside = false;
          }
        });
      } else if (ref.current && ref.current.contains(event.target)) {
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
