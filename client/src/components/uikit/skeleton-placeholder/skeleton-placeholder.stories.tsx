import type { Meta, StoryObj } from '@storybook/react';

import { Stack } from '~/uikit/stack';

import { SkeletonPlaceholder } from '.';

export default {
  title: 'SkeletonPlaceholder',
  component: SkeletonPlaceholder,
  decorators: [
    Story => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SkeletonPlaceholder>;

type Story = StoryObj<typeof SkeletonPlaceholder>;

export const Example: Story = {
  render: () => (
    <Stack direction="column" gap="$xl">
      <SkeletonPlaceholder width={400} height={40} borderRadius="small" />

      <Stack direction="row" gap="$xl">
        <SkeletonPlaceholder width={200} height={200} borderRadius="full" />
        <Stack direction="column" gap="$large" style={{ flexGrow: 1 }}>
          <SkeletonPlaceholder height={200} borderRadius="regular" />
          <SkeletonPlaceholder
            width={500}
            height={100}
            borderRadius="regular"
          />
        </Stack>
      </Stack>
    </Stack>
  ),
};
