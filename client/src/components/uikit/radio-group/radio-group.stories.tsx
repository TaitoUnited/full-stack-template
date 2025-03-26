import type { Meta, StoryObj } from '@storybook/react';

import { RadioGroup } from '.';

export default {
  title: 'RadioGroup',
  component: RadioGroup,
  decorators: [
    Story => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
      { label: 'Option 4', value: '4' },
    ],
  },
} satisfies Meta<typeof RadioGroup>;

type Story = StoryObj<typeof RadioGroup>;

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
    label: 'Disabled radio group',
    isDisabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required radio group',
    isRequired: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Invalid radio group',
    validationMessage: 'This is really bad',
  },
};

export const Description: Story = {
  args: {
    label: 'Radio group with description',
    description: 'This is a description',
  },
};
