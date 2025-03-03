import { useEffect, useRef } from 'react';
import { CalendarGrid } from 'react-aria-components';
import type { CalendarState, RangeCalendarState } from 'react-stately';

import { styled } from '~/styled-system/jsx';

/**
 * A Year grid that changes react aria component calendar state when a year is selected
 */
export function CalendarYearGrid({
  state,
  onChange,
}: {
  state: CalendarState | RangeCalendarState;
  onChange: () => void;
}) {
  const selectedYearButtonRef = useRef<HTMLButtonElement | null>(null);
  const yearContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedYearButtonRef.current && yearContainerRef.current) {
      selectedYearButtonRef.current.focus(); // Ensures the current year is focused when tabbing in

      // Scroll selected year into view
      const offset = selectedYearButtonRef.current.offsetTop;
      const selectedButtonHeight =
        selectedYearButtonRef.current.getBoundingClientRect().height;
      const containerHeight =
        yearContainerRef.current.getBoundingClientRect().height;

      yearContainerRef.current.scrollTo({
        top: offset - containerHeight / 2 + selectedButtonHeight / 2,
      });
    }
  }, []);

  return (
    <CalendarGrid>
      <YearGrid ref={yearContainerRef}>
        {Array.from(Array(150), (_, i) => i + 1900).map(year => (
          <YearButton
            key={year}
            ref={state.focusedDate.year === year ? selectedYearButtonRef : null}
            selected={state.focusedDate.year === year}
            onClick={() => {
              state.setFocusedDate(state.focusedDate.set({ year }));
              onChange();
            }}
            onKeyDown={e => e.stopPropagation()} // Prevent event bubbling
          >
            {year}
          </YearButton>
        ))}
      </YearGrid>
    </CalendarGrid>
  );
}

const YearGrid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: `repeat(5, 1fr)`,
    columnGap: '$xxs',
    rowGap: '$xs',
    height: '200px',
    overflowY: 'scroll',
    padding: '$xs',
    $customScrollbar: true,
  },
});

const YearButton = styled('button', {
  base: {
    borderRadius: '$small',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textStyle: '$bodySemiBold',
    height: '32px',
    padding: '$small',
    color: '$text',
    '&:hover': {
      backgroundColor: '$neutral5',
    },
    '&:focus-visible': {
      $focusRing: true,
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '$primary',
        color: '$textOnContrastingBg',
        '&:hover': {
          backgroundColor: '$primaryHover',
        },
      },
    },
  },
});
