import { useEffect, useState } from 'react';

import { useEffectEvent } from './use-effect-event';

export function useKeyPressState(key: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    function downHandler(event: KeyboardEvent) {
      if (event.key === key) setPressed(true);
    }

    function upHandler(event: KeyboardEvent) {
      if (event.key === key) setPressed(false);
    }

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [key]);

  return pressed;
}

export function useKeyPressEvent({
  key,
  enabled = true,
  capture = false,
  handler,
}: {
  key: string;
  enabled?: boolean;
  /**
   * Whether to listen for the event in the capture phase and stop propagation.
   * Useful for overriding React Aria default behavior.
   *
   * @ref https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#capture
   */
  capture?: boolean;
  handler: (event: KeyboardEvent) => void;
}) {
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) return;

    function eventHandler(event: KeyboardEvent) {
      if (event.key === key) stableHandler(event);
    }

    window.addEventListener('keydown', eventHandler, { capture });

    return () =>
      window.removeEventListener('keydown', eventHandler, { capture });
  }, [key, enabled, capture]);
}
