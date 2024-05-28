import { capitalize } from 'lodash';
import { ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Stack, Modal, Text, Icon, Button, TextInput } from '~uikit';

export default {
  title: 'Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

type Story = StoryObj<typeof Modal>;

export const Full: Story = {
  render: () => (
    <Stack direction="row" gap="regular">
      <ModalExample kind="full" placement="middle" />
      <ModalExample kind="full" placement="top" />
      <ModalExample kind="full" placement="bottom" />
      <ModalExample kind="full" placement="drawer" />
    </Stack>
  ),
};

export const Basic: Story = {
  render: () => (
    <Stack direction="row" gap="regular">
      <ModalExample kind="basic" placement="middle" />
      <ModalExample kind="basic" placement="top" />
      <ModalExample kind="basic" placement="bottom" />
      <ModalExample kind="basic" placement="drawer" />
    </Stack>
  ),
};

export const CustomHeader: Story = {
  render: () => (
    <Stack direction="row" gap="regular">
      <ModalExample kind="custom-header" placement="middle" />
      <ModalExample kind="custom-header" placement="top" />
      <ModalExample kind="custom-header" placement="bottom" />
      <ModalExample kind="custom-header" placement="drawer" />
    </Stack>
  ),
};

function ModalExample({
  placement,
  kind,
}: {
  placement: ComponentProps<typeof Modal>['placement'];
  kind: 'full' | 'basic' | 'custom-header';
}) {
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <Button variant="filled" color="primary" onPress={() => setOpen(true)}>
        {capitalize(placement)}
      </Button>

      <Modal placement={placement} isOpen={isOpen} onOpenChange={setOpen}>
        {kind === 'custom-header' ? (
          <Modal.Header>
            <Stack direction="row" gap="small" align="center">
              <Icon name="calendarMonth" size={32} color="text" aria-hidden />
              <Stack direction="column" gap="none">
                <Text variant="headingL" as="span">
                  Custom modal title!
                </Text>
                <Text variant="bodySmall">
                  This is a description for the header.
                </Text>
              </Stack>
            </Stack>
          </Modal.Header>
        ) : (
          <Modal.Header title="Example modal" />
        )}

        <Modal.Body>
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
        </Modal.Body>

        {kind === 'full' && (
          <Modal.Footer>
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
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}
