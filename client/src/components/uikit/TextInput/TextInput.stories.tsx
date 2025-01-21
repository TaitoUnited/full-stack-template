import type { Meta, StoryObj } from '@storybook/react';

import { TextInput } from '~uikit';

export default {
  title: 'TextInput',
  component: TextInput,
  decorators: [
    Story => (
      <div style={{ maxWidth: '300px' }}>
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
    errorMessage: "Please don't do this",
  },
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
