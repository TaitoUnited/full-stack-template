import { type RefObject, useEffect } from 'react';

import { useEffectEvent } from './use-effect-event';

/**
 * Listen for events on a target element without having to worry about
 * cleaning up the event listener when the component unmounts.
 *
 * NOTE: a stable reference to the handler function is automatically created
 * so you don't have to memoize it yourself.
 *
 * @param eventTarget Target element to listen for events on. Can be either a ref or the `document`.
 * @param eventName Which event to listen for, eg. 'mouseup', 'scroll', etc.
 * @param handler The event handler function to call when the event is triggered.
 */
export function useEventListener<
  K extends keyof DocumentEventMap,
  T extends (...args: any[]) => any,
>({
  enabled = true,
  ref,
  event,
  handler,
}: {
  enabled?: boolean;
  ref: Document | RefObject<HTMLElement | null>;
  event: K;
  handler: T;
}) {
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) return;

    let target: Document | HTMLElement | null = null;

    if ('current' in ref) {
      target = ref.current;
    } else {
      target = ref;
    }

    if (!target) return;

    target.addEventListener(event, stableHandler);

    return () => {
      if (!target) return;
      target.removeEventListener(event, stableHandler);
    };
  }, [enabled]);
}
