import type { Meta, StoryObj } from '@storybook/react';

import { ids } from '~design-tokens/icon-sprite-ids';
import { Icon, Tooltip } from '~uikit';

export default {
  title: 'Icon',
  component: Icon,
} satisfies Meta<typeof Icon>;

type Story = StoryObj<typeof Icon>;

export const All: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
        gap: 20,
        padding: 20,
      }}
    >
      {ids.map((name, i) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <Tooltip content={name} key={i}>
          <Tooltip.Trigger>
            <div
              style={{
                display: 'flex',
                placeContent: 'center',
                padding: 4,
              }}
            >
              <Icon name={name} size={24} color="text" />
            </div>
          </Tooltip.Trigger>
        </Tooltip>
      ))}
    </div>
  ),
};
