import { useLingui } from '@lingui/react/macro';
import { capitalize } from 'lodash';
import { CalendarGrid } from 'react-aria-components';
import type { CalendarState, RangeCalendarState } from 'react-stately';

import { styled } from '~/styled-system/jsx';

/**
 * A Month grid that changes react aria component calendar state when a month is selected
 */
export function CalendarMonthGrid({
  state,
  onChange,
}: {
  state: CalendarState | RangeCalendarState;
  onChange: () => void;
}) {
  const { i18n } = useLingui();
  return (
    <CalendarGrid>
      <MonthGrid>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
          <tr key={month}>
            <td>
              <MonthButton
                selected={state.focusedDate.month === month}
                onClick={() => {
                  state.setFocusedDate(state.focusedDate.set({ month }));
                  onChange();
                }}
              >
                {capitalize(
                  // Native Date object's index starts from 0, so we must subtract 1
                  new Date(0, month - 1).toLocaleDateString(i18n.locale, {
                    month: 'long',
                  })
                )}
              </MonthButton>
            </td>
          </tr>
        ))}
      </MonthGrid>
    </CalendarGrid>
  );
}

const MonthGrid = styled('tbody', {
  base: {
    display: 'grid',
    gridTemplateColumns: `repeat(3, 1fr)`,
    rowGap: '$xs',
    columnGap: '$xxs',
  },
});

const MonthButton = styled('button', {
  base: {
    borderRadius: '$small',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textStyle: '$bodySemiBold',
    height: '32px',
    padding: '$small',
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
