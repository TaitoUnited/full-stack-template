import type { Meta, StoryObj } from '@storybook/react';

import { Spinner, Stack } from '~uikit';

export default {
  title: 'Spinner',
  component: Spinner,
  decorators: [
    Story => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Spinner>;

type Story = StoryObj<typeof Spinner>;

const colors = ['primary', 'text', 'info', 'warn', 'error'] as const;

export const Color: Story = {
  render: () => (
    <Stack direction="row" gap="regular">
      {colors.map(color => (
        <Spinner key={color} color={color} size="medium" />
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="large">
      <Spinner color="primary" size="small" />
      <Spinner color="primary" size="normal" />
      <Spinner color="primary" size="medium" />
      <Spinner color="primary" size="large" />
    </Stack>
  ),
};
