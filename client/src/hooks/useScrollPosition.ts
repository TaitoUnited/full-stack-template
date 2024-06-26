import { RefObject, useState } from 'react';

import { useResizeObserver } from './useResizeObserver';
import { useScrollEvent } from './useScrollEvent';

// NOTE: `none` means that the element is not scrollable in the given axis
type ScrollPosition = 'none' | 'start' | 'middle' | 'end';

/**
 * Hook for subscribing to horizontal or vertical scroll position of an element.
 * This can be useful for determining if the user has scrolled to the start,
 * middle or end of a container and you want to for example show scrolling
 * indicators based on that or load more content etc.
 */
export function useScrollPosition(
  ref: RefObject<HTMLElement>,
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

  useResizeObserver(ref, () => {
    determineScrollPosition();
  });

  useScrollEvent(ref, () => {
    determineScrollPosition();
  });

  return scrollPosition;
}

function determineVerticalScrollPosition(element: HTMLElement): ScrollPosition {
  if (element.scrollHeight > element.clientHeight) {
    if (element.scrollTop === 0) {
      return 'start';
    } else if (
      Math.ceil(element.scrollTop) + element.clientHeight >=
      element.scrollHeight
    ) {
      return 'end';
    } else {
      return 'middle';
    }
  } else {
    return 'none';
  }
}

function determineHorisontalScrollPosition(
  element: HTMLElement
): ScrollPosition {
  if (element.scrollWidth > element.clientWidth) {
    if (element.scrollLeft === 0) {
      return 'start';
    } else if (
      Math.ceil(element.scrollLeft) + element.clientWidth >=
      element.scrollWidth
    ) {
      return 'end';
    } else {
      return 'middle';
    }
  } else {
    return 'none';
  }
}
