import type { Meta, StoryObj } from '@storybook/react';

import { ScrollView } from './index';

export default {
  title: 'ScrollView',
  component: ScrollView,
  decorators: [
    Story => (
      <div
        style={{
          maxWidth: '400px',
          height: '500px',
          background: '#fff',
          display: 'flex',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollView>;

export const Default: StoryObj<typeof ScrollView> = {
  args: {
    children: <Content />,
  },
};

function Content() {
  return (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
      }}
    >
      {Array.from({ length: 100 }).map((_, index) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <li key={index} style={{ height: 100, background: '#eee' }} />
      ))}
    </ul>
  );
}
