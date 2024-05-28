import type { Meta, StoryObj } from '@storybook/react';

import { IconButton, Stack } from '~uikit';

export default {
  title: 'IconButton',
  component: IconButton,
} satisfies Meta<typeof IconButton>;

type Story = StoryObj<typeof IconButton>;

const variants = ['filled', 'outlined', 'soft', 'plain'] as const;
const colors = ['primary', 'error', 'success'] as const;

export const Variations: Story = {
  render: () => (
    <Stack direction="row" gap="medium">
      {variants.map(variant => (
        <Stack key={variant} direction="row" gap="regular" align="flex-start">
          {colors.map(color => (
            <IconButton
              key={color}
              color={color}
              label="Icon button"
              icon="bellFilled"
            />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
