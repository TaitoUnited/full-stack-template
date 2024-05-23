import type { Meta, StoryObj } from '@storybook/react';

import { FillButton, Tooltip } from '~uikit';

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
    children: <FillButton variant="primary">Top</FillButton>,
    placement: 'top',
  },
};

export const Bottom: Story = {
  args: {
    content: 'I am a tooltip',
    children: <FillButton variant="primary">Bottom</FillButton>,
    placement: 'bottom',
  },
};

export const Left: Story = {
  args: {
    content: 'I am a tooltip',
    children: <FillButton variant="primary">Left</FillButton>,
    placement: 'left',
  },
};

export const Right: Story = {
  args: {
    content: 'I am a tooltip',
    children: <FillButton variant="primary">Right</FillButton>,
    placement: 'right',
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
