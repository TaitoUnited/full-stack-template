import { ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { fetchStarWarsCharacter } from '../helpers';
import { MultiSelect } from '~uikit';

export default {
  title: 'MultiSelect',
  component: MultiSelect,
  decorators: [
    Story => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MultiSelect>;

type Story = StoryObj<typeof MultiSelect>;

export const Regular: Story = {
  render: args => <MultiSelectExample {...args} />,
};

export const WithIcon: Story = {
  args: { icon: 'group' },
  render: args => <MultiSelectExample {...args} />,
};

export const WithDescription: Story = {
  args: { description: 'Type eg. "luke" to filter the options' },
  render: args => <MultiSelectExample {...args} />,
};

export const WithError: Story = {
  args: { errorMessage: 'May the force NOT be with you' },
  render: args => <MultiSelectExample {...args} />,
};

export const WithConfirmation: Story = {
  args: { isConfirmationRequired: true },
  render: args => <MultiSelectExample {...args} />,
};

function MultiSelectExample(props: ComponentProps<typeof MultiSelect>) {
  const [selected, setSelected] = useState(new Set<string>());

  return (
    <MultiSelect
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
