import type { Meta, StoryObj } from '@storybook/react';

import { Select } from '~/uikit/select';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';
import { TextInput } from '~/uikit/text-input';

import { Card } from '.';

export default {
  title: 'Card',
  component: Card,
  decorators: [
    // TODO: figure out why pandacss doesn't work with the decorators
    Story => (
      <div style={{ padding: 200, background: '#f2f3f5' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const Example: Story = {
  render: () => (
    <Card>
      <Stack direction="column" gap="$large">
        <Stack direction="column" gap="$small">
          <Text variant="headingM">Title</Text>
          <Text variant="body">Card content can be anything</Text>
        </Stack>

        <Stack direction="column" gap="$regular">
          <TextInput label="Input label" placeholder="Input placeholder" />
          <Select
            label="Select label"
            placeholder="Select placeholder"
            items={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' },
              { value: '3', label: 'Option 3' },
            ]}
          />
        </Stack>
      </Stack>
    </Card>
  ),
};
