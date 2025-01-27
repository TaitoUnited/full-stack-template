import type { Meta, StoryObj } from '@storybook/react';
import { capitalize } from 'lodash';
import { type ComponentProps, useState } from 'react';

import { Button } from '~/uikit/button';
import { Dialog } from '~/uikit/dialog';
import { Icon } from '~/uikit/icon';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';
import { TextInput } from '~/uikit/text-input';

export default {
  title: 'Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

type Story = StoryObj<typeof Dialog>;

export const Full: Story = {
  render: () => (
    <Stack direction="row" gap="regular">
      <DialogExample kind="full" placement="middle" />
      <DialogExample kind="full" placement="top" />
      <DialogExample kind="full" placement="bottom" />
      <DialogExample kind="full" placement="drawer" />
    </Stack>
  ),
};

export const Basic: Story = {
  render: () => (
    <Stack direction="row" gap="regular">
      <DialogExample kind="basic" placement="middle" />
      <DialogExample kind="basic" placement="top" />
      <DialogExample kind="basic" placement="bottom" />
      <DialogExample kind="basic" placement="drawer" />
    </Stack>
  ),
};

export const CustomHeader: Story = {
  render: () => (
    <Stack direction="row" gap="regular">
      <DialogExample kind="custom-header" placement="middle" />
      <DialogExample kind="custom-header" placement="top" />
      <DialogExample kind="custom-header" placement="bottom" />
      <DialogExample kind="custom-header" placement="drawer" />
    </Stack>
  ),
};

function DialogExample({
  placement,
  kind,
}: {
  placement: ComponentProps<typeof Dialog>['placement'];
  kind: 'full' | 'basic' | 'custom-header';
}) {
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <Button variant="filled" color="primary" onPress={() => setOpen(true)}>
        {capitalize(placement)}
      </Button>

      <Dialog placement={placement} isOpen={isOpen} onOpenChange={setOpen}>
        {kind === 'custom-header' ? (
          <Dialog.Header>
            <Stack direction="row" gap="small" align="center">
              <Icon name="calendarMonth" size={32} color="text" aria-hidden />
              <Stack direction="column" gap="none">
                <Text variant="headingL" as="span">
                  Custom dialog title!
                </Text>
                <Text variant="bodySmall">
                  This is a description for the header.
                </Text>
              </Stack>
            </Stack>
          </Dialog.Header>
        ) : (
          <Dialog.Header title="Example dialog" />
        )}

        <Dialog.Body>
          <Stack direction="column" gap="regular">
            <TextInput
              label="Random input"
              value={inputValue}
              onChange={setInputValue}
            />
            <Text variant="body" lineHeight={1.5}>
              Branding product management partner network advisor equity
              monetization sales business-to-consumer buzz facebook client
              ecosystem. IPhone technology angel investor analytics responsive
              web design pivot stock user experience creative leverage
              conversion interaction design branding. Business-to-consumer
              customer mass market buyer ecosystem startup advisor incubator
              bandwidth.
            </Text>
          </Stack>
        </Dialog.Body>

        {kind === 'full' && (
          <Dialog.Footer>
            <Stack direction="row" gap="xs">
              <Button
                variant="outlined"
                color="primary"
                onPress={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="primary"
                onPress={() => setOpen(false)}
              >
                Save
              </Button>
            </Stack>
          </Dialog.Footer>
        )}
      </Dialog>
    </>
  );
}
