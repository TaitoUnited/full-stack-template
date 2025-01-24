import type { Meta, StoryObj } from '@storybook/react';

import { AlertDialog, AlertDialogProvider, useAlertDialog } from '.';
import { Button } from '../button';
import { Stack } from '../stack';
import { Text } from '../text';

export default {
  title: 'AlertDialog',
  component: AlertDialog,
  decorators: [
    Story => (
      <div
        style={{
          padding: '200px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
        <AlertDialogProvider />
      </div>
    ),
  ],
} satisfies Meta<typeof AlertDialog>;

type Story = StoryObj<typeof AlertDialog>;

export const Basic: Story = {
  render: () => <Example />,
};

function Example() {
  const alertDialog = useAlertDialog();

  function showAlertDialog() {
    alertDialog.show({
      title: 'Are you sure?',
      content: (
        <Stack direction="column" gap="xs">
          <Text variant="body">
            Dropping the database can be fun but dangerous.
          </Text>
          <Text variant="bodySemiBold">Make sure you have backups!</Text>
        </Stack>
      ),
      buttons: [
        {
          text: 'Cancel',
          color: 'primary',
          variant: 'outlined',
        },
        {
          text: 'Yes, drop it',
          color: 'error',
          variant: 'filled',
          onPress: () => {
            console.log('Dro dro dro drop the database');
          },
        },
      ],
    });
  }

  return (
    <Button variant="filled" color="error" onPress={showAlertDialog}>
      Drop database
    </Button>
  );
}
