import { getLocalTimeZone, today } from '@internationalized/date';
import { useLingui } from '@lingui/react/macro';
import { Fragment } from 'react';
import { type DateRange } from 'react-aria';

import { Grid, Spacer, styled } from '~/styled-system/jsx';

import { Button } from '../button';

type PredefinedRangesProps = {
  currentRange: DateRange | null;
  onSelectRange: (range: DateRange) => Promise<void>;
};

export function PredefinedRanges({
  currentRange,
  onSelectRange,
}: PredefinedRangesProps) {
  const predefinedRanges = usePredefinedDateRanges();

  return (
    <Fragment>
      <Grid gap="$small" columns={{ base: 2, sm: 1 }}>
        {predefinedRanges.map(({ label, range }) => (
          <PredefinedRange
            key={label}
            isCurrentRange={
              currentRange?.start.toString() === range.start.toString() &&
              currentRange?.end.toString() === range.end.toString()
            }
            onPress={() => onSelectRange(range)}
          >
            {label}
          </PredefinedRange>
        ))}
      </Grid>
      <PredefinedRangeSpacer />
    </Fragment>
  );
}

function usePredefinedDateRanges() {
  const { t } = useLingui();
  const now = today(getLocalTimeZone());

  return [
    {
      label: t`Today`,
      range: {
        start: now,
        end: now,
      },
    },
    {
      label: t`Yesterday`,
      range: {
        start: now.subtract({ days: 1 }),
        end: now.subtract({ days: 1 }),
      },
    },
    {
      label: t`Last 7 Days`,
      range: {
        start: now.subtract({ days: 7 }),
        end: now,
      },
    },
    {
      label: t`Last 14 Days`,
      range: {
        start: now.subtract({ days: 14 }),
        end: now,
      },
    },
    {
      label: t`Last 30 Days`,
      range: {
        start: now.subtract({ days: 30 }),
        end: now,
      },
    },
    {
      label: t`This Year`,
      range: {
        start: now.set({ month: 1, day: 1 }),
        end: now, // We want to select this year up to today
      },
    },
    {
      label: t`Last Year`,
      range: {
        start: now.subtract({ years: 1 }).set({ month: 1, day: 1 }),
        end: now.subtract({ years: 1 }).set({ month: 12, day: 31 }),
      },
    },
  ];
}

const PredefinedRange = styled(Button, {
  base: {
    padding: '$xs',
    borderRadius: '$small',
    fontSize: 'small',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 150ms',
    '&:hover': {
      backgroundColor: '$neutral4',
    },
    '&:focus-visible': {
      $focusRing: true,
    },
  },
  variants: {
    isCurrentRange: {
      true: {
        backgroundColor: '$neutral3',
      },
    },
  },
});

const PredefinedRangeSpacer = styled(Spacer, {
  base: {
    width: '$regular',
    border: '0.1px solid',
    borderColor: '$neutral3',
  },
});
