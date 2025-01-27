import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, useState } from 'react';

import { AsyncSelect } from '.';
import { fetchStarWarsCharacter } from '../helpers';

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

export const LabelPosition: Story = {
  args: { labelPosition: 'left' },
  render: args => <AsyncSelectExample {...args} />,
};

export const HiddenLabel: Story = {
  args: { hiddenLabel: 'Hidden label' },
  render: args => <AsyncSelectExample {...args} />,
};

export const Disabled: Story = {
  args: { isDisabled: true },
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

export const WithClearing: Story = {
  args: { actions: { clear: true } },
  render: args => <AsyncSelectExample {...args} />,
};

export const WithClearAndConfirm: Story = {
  args: { actions: { confirm: true, clear: true } },
  render: args => <AsyncSelectExample {...args} />,
};

function AsyncSelectExample(props: ComponentProps<typeof AsyncSelect>) {
  const [value, setValue] = useState(() => new Set<string>());

  return (
    <AsyncSelect
      {...props}
      label={props.hiddenLabel ? undefined : 'Star Wars characters'}
      placeholder="Select characters"
      emptyMessage="These aren't the droids you're looking for"
      value={value}
      onChange={setValue}
      loadItems={params =>
        fetchStarWarsCharacter(params).then(items => ({ items }))
      }
    />
  );
}
