import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, useState } from 'react';

import { SegmentedControl } from '.';

export default {
  title: 'SegmentedControl',
  component: SegmentedControl,
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
} satisfies Meta<typeof SegmentedControl>;

type Story = StoryObj<typeof SegmentedControl>;

export const Basic: Story = {
  render: args => <Example {...args} />,
  args: {
    segments: [
      { id: 'example', label: 'Example' },
      { id: 'another', label: 'Another' },
      { id: 'yet-another', label: 'Yet another' },
    ],
  },
};

export const Disabled: Story = {
  render: args => <Example {...args} />,
  args: {
    segments: [
      { id: 'example', label: 'Example' },
      { id: 'another', label: 'Another' },
      { id: 'disabled', label: 'Disabled', disabled: true },
    ],
  },
};

export const WithIcon: Story = {
  render: args => <Example {...args} />,
  args: {
    segments: [
      { id: 'example', label: 'Example', icon: 'bank' },
      { id: 'another', label: 'Another', icon: 'heart' },
      { id: 'yet-another', label: 'Yet another', icon: 'shoppingCart' },
    ],
  },
};

function Example(props: ComponentProps<typeof SegmentedControl>) {
  const [segement, setSegment] = useState(props.segments[0]!.id);

  return <SegmentedControl {...props} value={segement} onChange={setSegment} />;
}
