import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, useState } from 'react';

import { MultiSelectCombobox } from '.';

export default {
  title: 'MultiSelectCombobox',
  component: MultiSelectCombobox,
  decorators: [
    Story => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MultiSelectCombobox>;

type Story = StoryObj<typeof MultiSelectCombobox>;

const options = [
  { label: 'Apple (Malus domestica)', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry (Prunus avium, a type of Rosaceae)', value: 'cherry' },
  {
    label: 'Dragon Fruit (Hylocereus undatus, also known as pitaya)',
    value: 'dragonfruit',
  },
  { label: 'Grapes (Vitis vinifera)', value: 'grapes' },
  { label: 'Orange (Citrus sinensis)', value: 'orange' },
  { label: 'Peach (Prunus persica)', value: 'peach' },
  { label: 'Pear (Pyrus communis)', value: 'pear' },
  { label: 'Plum (Prunus domestica)', value: 'plum' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Watermelon (Citrullus lanatus)', value: 'watermelon' },
];

export const Regular: Story = {
  args: {
    label: 'MultiSelect with Combobox',
    items: options,
  },
  render: args => <MultiSelectExample {...args} />,
};

export const LabelPosition: Story = {
  args: {
    label: 'Regular select',
    labelPosition: 'left',
    items: options,
  },
  render: args => <MultiSelectExample {...args} />,
};

export const Disabled: Story = {
  args: {
    label: 'Disabled select',
    items: options,
    isDisabled: true,
  },
  render: args => <MultiSelectExample {...args} />,
};

export const Required: Story = {
  args: {
    label: 'Required select',
    items: options,
    isRequired: true,
  },
  render: args => <MultiSelectExample {...args} />,
};

export const WithIcon: Story = {
  args: {
    label: 'With icon',
    items: options,
    icon: 'apps',
  },
  render: args => <MultiSelectExample {...args} />,
};

export const WithDescription: Story = {
  args: {
    label: 'Descriptions also',
    description: 'You should pick the third one',
    items: options,
  },
  render: args => <MultiSelectExample {...args} />,
};

export const WithError: Story = {
  args: {
    label: 'Some invalid choice',
    errorMessage: 'This is really bad',
    items: options,
  },
  render: args => <MultiSelectExample {...args} />,
};

function MultiSelectExample(props: ComponentProps<typeof MultiSelectCombobox>) {
  const [value, setValue] = useState<string[]>([]);

  return (
    <MultiSelectCombobox
      {...props}
      label={props.label ?? 'This is an example'}
      value={value}
      onChange={setValue}
    />
  );
}
