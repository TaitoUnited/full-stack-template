import type { Meta, StoryObj } from '@storybook/react';

import { Select } from '.';

export default {
  title: 'Select',
  component: Select,
  decorators: [
    Story => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

type Story = StoryObj<typeof Select>;

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
];

export const Regular: Story = {
  args: {
    label: 'Regular select',
    items: options,
  },
};

export const LabelPosition: Story = {
  args: {
    label: 'Regular select',
    labelPosition: 'left',
    items: options,
  },
};

export const HiddenLabel: Story = {
  args: {
    hiddenLabel: 'Hidden label',
    items: options,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled select',
    items: options,
    isDisabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required select',
    items: options,
    isRequired: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'With icon',
    items: options,
    icon: 'apps',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Descriptions also',
    description: 'You should pick the third one',
    items: options,
  },
};

export const WithError: Story = {
  args: {
    label: 'Some invalid choice',
    errorMessage: 'This is really bad',
    items: options,
  },
};
