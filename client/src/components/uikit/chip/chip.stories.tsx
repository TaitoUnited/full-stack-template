import type { Meta, StoryObj } from '@storybook/react';

import { Chip } from './index';

export default {
  title: 'Chip',
  component: Chip,
} satisfies Meta<typeof Chip>;

export const Default: StoryObj<typeof Chip> = {
  args: {
    children: 'Default Chip',
  },
};

export const Removable: StoryObj<typeof Chip> = {
  args: {
    children: 'Removable Chip',
    removable: true,
    onRemove: () => alert('Chip removed'),
  },
};

export const Variants: StoryObj<typeof Chip> = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Chip variant="valid">Valid</Chip>
      <Chip variant="warning">Warning</Chip>
      <Chip variant="error">Error</Chip>
      <Chip variant="descriptive">Descriptive</Chip>
    </div>
  ),
};
