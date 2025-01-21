import type { Meta, StoryObj } from '@storybook/react';
import { useAsyncList } from 'react-stately';

import { ComboBox, type ComboBoxOption } from '~uikit';

import { fetchStarWarsCharacter } from '../helpers';

export default {
  title: 'ComboBox',
  component: ComboBox,
  decorators: [
    Story => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComboBox>;

type Story = StoryObj<typeof ComboBox>;

const options: ComboBoxOption[] = [
  { label: 'Cat', value: '1' },
  { label: 'Dog', value: '2' },
  { label: 'Horse', value: '3', description: 'Very special!' },
  { label: 'Cow', value: '4' },
  { label: 'Horseradish', value: '5' },
];

export const Regular: Story = {
  args: {
    defaultItems: options,
    label: 'Regular combobox',
  },
};

export const Disabled: Story = {
  args: {
    defaultItems: options,
    label: 'Disabled combobox',
    isDisabled: true,
  },
};

export const Required: Story = {
  args: {
    defaultItems: options,
    label: 'Required combobox',
    isRequired: true,
  },
};

export const WithIcon: Story = {
  args: {
    defaultItems: options,
    label: 'With icon',
    icon: 'cloud',
  },
};

export const WithDescription: Story = {
  args: {
    defaultItems: options,
    label: 'Descriptions also',
    description: 'You should pick the third one',
  },
};

export const WithErrorMessage: Story = {
  args: {
    defaultItems: options,
    label: 'Some invalid choice',
    errorMessage: 'This is really bad',
  },
};

export const AsyncOptions: Story = {
  render: args => <AsyncOptionsStory {...args} />,
};

function AsyncOptionsStory() {
  const list = useAsyncList<ComboBoxOption>({
    async load({ signal, filterText }) {
      const items = await fetchStarWarsCharacter({ filterText, signal });
      return { items };
    },
  });

  return (
    <ComboBox
      label="Async options"
      icon="apps"
      items={list.items}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
    />
  );
}
