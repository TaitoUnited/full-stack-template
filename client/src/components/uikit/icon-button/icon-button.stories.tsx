import type { Meta, StoryObj } from '@storybook/react';

import { IconButton } from '~/uikit/icon-button';
import { Stack } from '~/uikit/stack';

export default {
  title: 'IconButton',
  component: IconButton,
} satisfies Meta<typeof IconButton>;

type Story = StoryObj<typeof IconButton>;

const variants = ['filled', 'outlined', 'soft', 'plain'] as const;
const colors = ['primary', 'error', 'success', 'neutral'] as const;
const sizes = ['small', 'medium', 'large'] as const;
const tooltipPlacements = ['top', 'bottom', 'left', 'right'] as const;

export const Variant: Story = {
  render: () => (
    <Stack direction="column" gap="$medium">
      {colors.map(color => (
        <Stack key={color} direction="row" gap="$regular">
          {variants.map(variant => (
            <IconButton
              key={variant}
              variant={variant}
              color={color}
              label={`Icon button ${variant}`}
              icon="document"
            />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Color: Story = {
  render: () => (
    <Stack direction="row" gap="$regular">
      {colors.map(color => (
        <IconButton
          key={color}
          variant="plain"
          color={color}
          label={`Icon button ${color}`}
          icon="document"
        />
      ))}
    </Stack>
  ),
};

export const Size: Story = {
  render: () => (
    <Stack direction="column" gap="$medium">
      {sizes.map(size => (
        <Stack key={size} direction="row" gap="$regular">
          {variants.map(variant => (
            <IconButton
              key={variant}
              variant={variant}
              size={size}
              label={`Icon button ${size}`}
              icon="filter"
            />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Tooltip: Story = {
  render: () => (
    <Stack direction="column" gap="$medium">
      {tooltipPlacements.map(tooltipPlacement => (
        <Stack key={tooltipPlacement} direction="row" gap="$regular">
          {variants.map(variant => (
            <IconButton
              key={variant}
              variant={variant}
              tooltipPlacement={tooltipPlacement}
              label="Icon button"
              icon="fullscreenOpen"
            />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
  decorators: [
    Story => (
      <div
        style={{
          padding: '50px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
