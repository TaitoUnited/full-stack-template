import {
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { type ComponentProps, useState } from 'react';

import { DatePicker } from '.';
import { Toaster } from '../toaster';

export default {
  title: 'DatePicker',
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

type Story = StoryObj<typeof DatePicker>;

const now = today(getLocalTimeZone());

export const Basic: Story = {
  args: {
    label: 'Pick date',
    defaultValue: now.subtract({ days: 1 }),
  },
  render: args => <Example {...args} />,
};

export const Required: Story = {
  args: {
    label: 'Pick date',
    isRequired: true,
  },
  render: args => <Example {...args} />,
};

export const Clear: Story = {
  args: {
    label: 'Pick date',
    defaultValue: now,
    clearable: true,
  },
  render: args => <Example {...args} />,
};

export const ClearAndCopy: Story = {
  args: {
    label: 'Pick date',
    defaultValue: now,
    copiable: true,
    clearable: true,
  },
  render: args => <Example {...args} />,
};

export const LabelPosition: Story = {
  args: {
    label: 'Pick date (label on the left side of the input)',
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
    label: 'Pick date',
    isDateUnavailable,
  },
  render: args => <Example {...args} />,
};

function Example({
  defaultValue,
  ...props
}: ComponentProps<typeof DatePicker>) {
  const [date, setDate] = useState(
    defaultValue ? defaultValue.toString() : undefined
  );

  return (
    <div
      style={{ maxWidth: props.labelPosition === 'left' ? '500px' : '220px' }}
    >
      <DatePicker {...props} value={date} onChange={setDate} />
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
