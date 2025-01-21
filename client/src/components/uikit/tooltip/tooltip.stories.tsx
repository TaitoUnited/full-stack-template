import type { Meta, StoryObj } from '@storybook/react';

import { Button, Tooltip } from '~uikit';

export default {
  title: 'Tooltip',
  component: Tooltip,
  decorators: [
    Story => (
      <div
        style={{
          padding: '100px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    content: 'I am a tooltip',
    placement: 'top',
    children: (
      <Button variant="filled" color="primary">
        Top
      </Button>
    ),
  },
};

export const Bottom: Story = {
  args: {
    content: 'I am a tooltip',
    placement: 'bottom',
    children: (
      <Button variant="filled" color="primary">
        Bottom
      </Button>
    ),
  },
};

export const Left: Story = {
  args: {
    content: 'I am a tooltip',
    placement: 'left',
    children: (
      <Button variant="filled" color="primary">
        Left
      </Button>
    ),
  },
};

export const Right: Story = {
  args: {
    content: 'I am a tooltip',
    placement: 'right',
    children: (
      <Button variant="filled" color="primary">
        Right
      </Button>
    ),
  },
};

export const CustomTrigger: Story = {
  args: {
    content: 'I am a tooltip',
    children: (
      <Tooltip.Trigger>
        <strong>Hover me</strong>
      </Tooltip.Trigger>
    ),
  },
};
