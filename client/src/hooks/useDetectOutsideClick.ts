import { type RefObject, useEffect } from 'react';

import { useEffectEvent } from './useEffectEvent';

/**
 * Detects if the user clicks outside of a DOM element.
 */
export function useDetectOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: () => void
) {
  const stableCallback = useEffectEvent(callback);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        event.stopPropagation();
        stableCallback();
      }
    }

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);
}
