import { type RefObject, useEffect } from 'react';

import { useStableCallback } from './use-stable-callback';

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
export function useEventListener<K extends keyof DocumentEventMap>({
  enabled = true,
  ref,
  event,
  handler,
}: {
  enabled?: boolean;
  ref: Document | RefObject<HTMLElement | null>;
  event: K;
  handler: DocumentEventMap[K] extends Event
    ? (event: DocumentEventMap[K]) => void
    : never;
}) {
  const stableHandler = useStableCallback(handler);

  useEffect(() => {
    if (!enabled) return;

    let target: Document | HTMLElement | null = null;

    if ('current' in ref) {
      target = ref.current;
    } else {
      target = ref;
    }

    if (!target) return;

    function handleEvent(eventObject: Event) {
      // The registered event name guarantees the corresponding event type.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      stableHandler(eventObject as DocumentEventMap[K]);
    }

    target.addEventListener(event, handleEvent);

    return () => {
      target.removeEventListener(event, handleEvent);
    };
  }, [enabled]);
}
