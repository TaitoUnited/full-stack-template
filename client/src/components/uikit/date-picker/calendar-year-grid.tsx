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
  const selectedYearButtonRef = useRef<HTMLTableRowElement>(null);
  const yearContainerRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    function handleScrollToYear() {
      if (!selectedYearButtonRef.current || !yearContainerRef.current) return;

      const offset = selectedYearButtonRef.current.offsetTop;
      const selectedButtonHeight =
        selectedYearButtonRef.current.getBoundingClientRect().height;
      const containerHeight =
        yearContainerRef.current.getBoundingClientRect().height;

      yearContainerRef.current.scrollTo({
        top: offset - containerHeight / 2 + selectedButtonHeight / 2,
      });
    }
    handleScrollToYear();
  }, []);

  return (
    <CalendarGrid>
      <YearGrid ref={yearContainerRef}>
        {Array.from(Array(150), (_, i) => i + 1900).map(year => (
          <tr
            key={year}
            ref={
              state.focusedDate.year === year
                ? selectedYearButtonRef
                : undefined
            }
          >
            <td>
              <YearButton
                selected={state.focusedDate.year === year}
                onClick={() => {
                  state.setFocusedDate(state.focusedDate.set({ year }));
                  onChange();
                }}
              >
                {year}
              </YearButton>
            </td>
          </tr>
        ))}
      </YearGrid>
    </CalendarGrid>
  );
}

const YearGrid = styled('tbody', {
  base: {
    display: 'grid',
    gridTemplateColumns: `repeat(5, 1fr)`,
    columnGap: '$xxs',
    rowGap: '$xs',
    height: '200px',
    overflowY: 'scroll',
    // $customScrollbar: true,
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
