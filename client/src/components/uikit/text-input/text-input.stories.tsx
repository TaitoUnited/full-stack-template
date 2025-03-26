import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { TextInput } from '.';

export default {
  title: 'TextInput',
  component: TextInput,
  decorators: [
    Story => (
      <div style={{ maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextInput>;

type Story = StoryObj<typeof TextInput>;

export const Regular: Story = {
  args: {
    label: 'Regular input',
    placeholder: 'Type something',
  },
};

export const LabelPosition: Story = {
  args: {
    label: 'Regular input',
    labelPosition: 'left',
    placeholder: 'Type something',
  },
};

export const HiddenLabel: Story = {
  args: {
    hiddenLabel: 'Hidden label',
    placeholder: 'Type something',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled input',
    isDisabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required input',
    isRequired: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Input with description',
    description: 'You should fill this one',
  },
};

export const WithError: Story = {
  args: {
    label: 'Erroring input',
    validationMessage: "Please don't do this",
  },
};

export const WithErrorPopover: Story = {
  render: () => <ErrorPopoverExample />,
};

export const WithIcon: Story = {
  args: {
    label: 'Icon input',
    icon: 'comment',
  },
};

export const Password: Story = {
  args: {
    label: 'Password input',
    type: 'password',
  },
};

function ErrorPopoverExample() {
  const [value, setValue] = useState('');

  return (
    <TextInput
      style={{ '--label-width': '150px' }}
      label="This needs a value"
      labelPosition="left"
      value={value}
      onChange={setValue}
      validationMessage={
        !value
          ? { message: 'This field is required', type: 'error' }
          : undefined
      }
    />
  );
}
