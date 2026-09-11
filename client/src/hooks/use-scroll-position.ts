import { type RefObject, useState } from 'react';

import { useEventListener } from './use-event-listener';
import { useResizeObserver } from './use-resize-observer';

// NOTE: `none` means that the element is not scrollable in the given axis
type ScrollPosition = 'none' | 'start' | 'middle' | 'end';

/**
 * Hook for subscribing to horizontal or vertical scroll position of an element.
 * This can be useful for determining if the user has scrolled to the start,
 * middle or end of a container and you want to for example show scrolling
 * indicators based on that or load more content etc.
 */
export function useScrollPosition(
  ref: RefObject<HTMLElement | null>,
  axis: 'horizontal' | 'vertical' = 'vertical'
) {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>('none');

  function determineScrollPosition() {
    if (ref.current) {
      const position =
        axis === 'horizontal'
          ? determineHorisontalScrollPosition(ref.current)
          : determineVerticalScrollPosition(ref.current);

      setScrollPosition(position);
    }
  }

  useResizeObserver({
    ref,
    handler: () => {
      determineScrollPosition();
    },
  });

  useEventListener({
    ref,
    event: 'scroll',
    handler: () => {
      determineScrollPosition();
    },
  });

  return scrollPosition;
}

function determineVerticalScrollPosition(element: HTMLElement): ScrollPosition {
  if (element.scrollHeight <= element.clientHeight) {
    return 'none';
  }

  if (element.scrollTop === 0) {
    return 'start';
  }

  if (
    Math.ceil(element.scrollTop) + element.clientHeight >=
    element.scrollHeight
  ) {
    return 'end';
  }

  return 'middle';
}

function determineHorisontalScrollPosition(
  element: HTMLElement
): ScrollPosition {
  if (element.scrollWidth <= element.clientWidth) {
    return 'none';
  }

  if (element.scrollLeft === 0) {
    return 'start';
  }

  if (
    Math.ceil(element.scrollLeft) + element.clientWidth >=
    element.scrollWidth
  ) {
    return 'end';
  }

  return 'middle';
}
