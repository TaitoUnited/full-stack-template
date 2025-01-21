import { useEffect, useState } from 'react';

export function useVirtualKeyboard() {
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (visualViewport) {
      function onResize() {
        const focusedElement = document.activeElement as HTMLElement | null;

        // Bail if no element is focused as that also means no input is focused
        if (!focusedElement) return;

        const isInputFocused =
          focusedElement.tagName === 'INPUT' ||
          focusedElement.tagName === 'TEXTAREA';

        // Virtual keyboard should only be visible if an input is focused
        if (
          isInputFocused &&
          visualViewport &&
          visualViewport.height < window.innerHeight
        ) {
          setKeyboardOpen(true);
          setKeyboardHeight(window.innerHeight - visualViewport.height);
        } else if (isKeyboardOpen) {
          // Reset keyboard height if it was open
          setKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      }

      visualViewport.addEventListener('resize', onResize);

      return () => {
        visualViewport.removeEventListener('resize', onResize);
      };
    }
  }, [isKeyboardOpen]);

  return { keyboardHeight, isKeyboardOpen };
}
