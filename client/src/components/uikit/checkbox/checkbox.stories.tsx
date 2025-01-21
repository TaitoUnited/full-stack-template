import type { Meta, StoryObj } from '@storybook/react';

import { css } from '~styled-system/css';
import { Checkbox, Stack, Text } from '~uikit';

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [
    Story => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

export const Regular: Story = {
  args: {
    label: 'Regular checkbox',
  },
};

export const ComponentLabel: Story = {
  args: {
    label: <Text variant="bodyBold">Styled label label</Text>,
  },
};

export const HiddenLabel: Story = {
  render: () => (
    <Stack direction="column" gap="small">
      <Text variant="body">(This checkbox has a hidden label)</Text>
      <Checkbox hiddenLabel="Testing" />
    </Stack>
  ),
};

export const OuterLabel: Story = {
  render: () => (
    <Stack direction="column" gap="small">
      <Text id="outer-label" variant="body">
        This label is connected via the `labelledby` prop
      </Text>
      <Checkbox labelledby="outer-label" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    isDisabled: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Invalid checkbox',
    isInvalid: true,
  },
};

export const Indeterminate: Story = {
  render: () => (
    <Stack direction="column" gap="small">
      <Checkbox isIndeterminate label="I'm not sure about myself" />
      <Stack
        direction="column"
        gap="xs"
        className={css({ paddingLeft: '$regular' })}
      >
        <Checkbox isSelected label="Child checkbox 1" />
        <Checkbox isSelected={false} label="Child checkbox 2" />
      </Stack>
    </Stack>
  ),
};
