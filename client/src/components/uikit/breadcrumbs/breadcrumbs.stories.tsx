import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Breadcrumbs } from '.';

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

type Story = StoryObj<typeof Breadcrumbs>;

export const Regular: Story = {
  render: args => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item to="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item>Current page</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};
