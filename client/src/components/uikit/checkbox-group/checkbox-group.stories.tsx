import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxGroup } from '.';

export default {
  title: 'CheckboxGroup',
  component: CheckboxGroup,
  decorators: [
    Story => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    options: [
      { label: 'Checkbox 1', value: '1' },
      { label: 'Checkbox 2', value: '2' },
      { label: 'Checkbox 3', value: '3' },
      { label: 'Checkbox 4', value: '4' },
    ],
  },
} satisfies Meta<typeof CheckboxGroup>;

type Story = StoryObj<typeof CheckboxGroup>;

export const Regular: Story = {
  args: {
    label: 'Choose one of these',
  },
};

export const LabelPosition: Story = {
  args: {
    label: 'I am a label on the left',
    labelPosition: 'left',
  },
};

export const HiddenLabel: Story = {
  args: {
    hiddenLabel: 'Hidden label',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox group',
    isDisabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required checkbox group',
    isRequired: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Invalid checkbox group',
    errorMessage: 'This is really bad',
  },
};

export const Description: Story = {
  args: {
    label: 'checkbox group with description',
    description: 'This is a description',
  },
};
