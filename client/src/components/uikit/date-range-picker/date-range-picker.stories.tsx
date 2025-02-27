import {
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, useState } from 'react';
import { type DateRange } from 'react-aria';

import { DateRangePicker } from '.';
import { Toaster } from '../toaster';

export default {
  title: 'DateRangePicker',
  component: DateRangePicker,
} satisfies Meta<typeof DateRangePicker>;

type Story = StoryObj<typeof DateRangePicker>;

const now = today(getLocalTimeZone());

export const Basic: Story = {
  args: {
    label: 'Pick date range',
    defaultValue: { start: now.subtract({ days: 7 }), end: now },
  },
  render: args => <Example {...args} />,
};

export const Required: Story = {
  args: {
    label: 'Pick date range',
    isRequired: true,
  },
  render: args => <Example {...args} />,
};

export const Clear: Story = {
  args: {
    label: 'Pick date range',
    defaultValue: { start: now.subtract({ days: 7 }), end: now },
    clearable: true,
  },
  render: args => <Example {...args} />,
};

export const PreDefinedRange: Story = {
  args: {
    label: 'Pick date range',
    defaultValue: { start: now.subtract({ days: 7 }), end: now },
    preDefinable: true,
  },
  render: args => <Example {...args} />,
};

export const LabelPosition: Story = {
  args: {
    label: 'Pick date range (label on the left side of the input)',
    labelPosition: 'left',
    isRequired: true,
  },
  render: args => <Example {...args} />,
};

export const HiddenLabel: Story = {
  args: {
    hiddenLabel: 'Hidden label',
  },
  render: args => <Example {...args} />,
};

export const UnavailableDates: Story = {
  args: {
    label: 'Pick date range',
    isDateUnavailable,
  },
  render: args => <Example {...args} />,
};

function Example({
  defaultValue,
  ...props
}: ComponentProps<typeof DateRangePicker>) {
  const [date, setDate] = useState<DateRange | null>(
    defaultValue ?? {
      start: now.subtract({ days: 7 }),
      end: now,
    }
  );

  return (
    <div
      style={{ maxWidth: props.labelPosition === 'left' ? '500px' : '250px' }}
    >
      <DateRangePicker {...props} value={date} onChange={setDate} />
      <Toaster />
    </div>
  );
}

function isDateUnavailable(date: DateValue) {
  const disabledRanges = [
    [now, now.add({ days: 5 })],
    [now.add({ days: 14 }), now.add({ days: 16 })],
    [now.add({ days: 23 }), now.add({ days: 24 })],
  ];

  return disabledRanges.some(
    interval =>
      interval[0] &&
      interval[1] &&
      date.compare(interval[0]) >= 0 &&
      date.compare(interval[1]) <= 0
  );
}
