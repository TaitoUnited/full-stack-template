import { ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { fetchStarWarsCharacter } from '../helpers';
import { AsyncSelect } from '~uikit';

export default {
  title: 'AsyncSelect',
  component: AsyncSelect,
  decorators: [
    Story => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AsyncSelect>;

type Story = StoryObj<typeof AsyncSelect>;

export const WithMultiSelect: Story = {
  render: args => <AsyncSelectExample {...args} />,
};

export const WithSingleSelect: Story = {
  args: { selectionMode: 'single' },
  render: args => <AsyncSelectExample {...args} />,
};

export const WithIcon: Story = {
  args: { icon: 'group' },
  render: args => <AsyncSelectExample {...args} />,
};

export const WithDescription: Story = {
  args: { description: 'Type eg. "luke" to filter the options' },
  render: args => <AsyncSelectExample {...args} />,
};

export const WithError: Story = {
  args: { errorMessage: 'May the force NOT be with you' },
  render: args => <AsyncSelectExample {...args} />,
};

export const WithConfirmation: Story = {
  args: { isConfirmationRequired: true },
  render: args => <AsyncSelectExample {...args} />,
};

function AsyncSelectExample(props: ComponentProps<typeof AsyncSelect>) {
  const [selected, setSelected] = useState(new Set<string>());

  return (
    <AsyncSelect
      {...props}
      label="Star Wars characters"
      placeholder="Select characters"
      emptyMessage="These aren't the droids you're looking for"
      selected={selected}
      onSelect={setSelected}
      loadOptions={params =>
        fetchStarWarsCharacter(params).then(items => ({ items }))
      }
    />
  );
}
