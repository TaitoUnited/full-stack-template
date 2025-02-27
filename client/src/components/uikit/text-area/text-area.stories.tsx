import type { Meta, StoryObj } from '@storybook/react';

import { TextArea } from '.';

export default {
  title: 'TextArea',
  component: TextArea,
  decorators: [
    Story => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

export const Regular: Story = {
  args: {
    label: 'Regular textarea',
    placeholder: 'Hello there',
    rows: 4,
  },
};

export const LabelPosition: Story = {
  args: {
    label: 'Regular textarea',
    labelPosition: 'left',
    placeholder: 'Hello there',
    rows: 4,
  },
};

export const HiddenLabel: Story = {
  args: {
    hiddenLabel: 'Hidden label',
    placeholder: 'Hello there',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled textarea',
    isDisabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required textarea',
    isRequired: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Textarea with description',
    description: 'You should fill this one',
  },
};

export const WithError: Story = {
  args: {
    label: 'Erroring textarea',
    validationMessage: "Please don't do this",
  },
};

export const AutoResize: Story = {
  args: {
    label: 'Auto-resizing textarea',
    autoResize: true,
  },
};
