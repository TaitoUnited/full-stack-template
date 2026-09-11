import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '~/uikit/button';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

import { Popover } from '.';

export default {
  title: 'Popover',
  component: Popover,
  decorators: [
    Story => (
      <div
        style={{
          padding: '200px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

type Story = StoryObj<typeof Popover>;

function Content() {
  return (
    <Stack direction="column" gap="xs">
      <Text variant="headingS">Heading</Text>
      <Text variant="bodySmall" style={{ maxWidth: 220 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta error
        cupiditate laboriosam numquam quos mollitia quo non minima vitae harum?
      </Text>
    </Stack>
  );
}

export const Top: Story = {
  args: {
    content: <Content />,
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
    content: <Content />,
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
    content: <Content />,
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
    content: <Content />,
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
    content: <Content />,
    children: (
      <Popover.Trigger>
        <strong>Click me</strong>
      </Popover.Trigger>
    ),
  },
};
