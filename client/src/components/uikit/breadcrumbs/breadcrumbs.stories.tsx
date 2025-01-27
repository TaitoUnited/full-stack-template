import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumbs } from '.';

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

type Story = StoryObj<typeof Breadcrumbs>;

export const Regular: Story = {
  render: args => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item to="/$workspaceId/posts">Posts</Breadcrumbs.Item>
      <Breadcrumbs.Item>Post 123</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};
