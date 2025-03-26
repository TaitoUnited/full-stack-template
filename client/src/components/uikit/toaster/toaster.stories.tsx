import type { Meta, StoryObj } from '@storybook/react';
import { type ToasterProps, useSonner } from 'sonner';

import { ids } from '~/design-tokens/icon-sprite-ids';

import { toast, Toaster, type ToasterOptions } from '.';
import { Button } from '../button';
import { type IconName } from '../icon';
import { Stack } from '../stack';

export default {
  title: 'Toaster',
  component: Toaster,
  argTypes: {
    closeButton: {
      control: 'boolean',
      defaultValue: false,
      description: 'Adds a close button to the toast.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    richColors: {
      control: 'boolean',
      defaultValue: true,
      description:
        "It is on by default **globally**. Remove it from the `<SonnerToaster />` if you don't want rich colors.",
      table: {
        defaultValue: { summary: true },
      },
    },
    icon: {
      control: 'select',
      options: ids,
      defaultValue: 'checkCircle',
      table: {
        defaultValue: { summary: 'null' },
      },
      description:
        'Icon that will replace the default icons. Does not work for `loading` and `promise` as they use a specific spinner.',
    },
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      defaultValue: 'bottom-right',
      description: 'The position of the toasts in the screen.',
      table: {
        defaultValue: { summary: 'bottom-right' },
      },
    },
  },
  decorators: [
    Story => (
      <div
        style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}
      >
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

type Story = StoryObj<typeof Toaster>;

const toastVariants = [
  'success',
  'error',
  'warning',
  'info',
  'loading',
] as const;

function createToast(
  variant: (typeof toastVariants)[number],
  options: ToasterOptions
) {
  toast[variant](`This is a ${variant} toast`, options);
}

function ToastOptions({
  closeButton,
  richColors,
  icon,
  position,
}: {
  closeButton?: boolean;
  richColors?: boolean;
  icon?: IconName;
  position?: ToasterProps['position'];
}) {
  const { toasts } = useSonner();

  return (
    <Stack direction="column" gap="$medium">
      {toastVariants.map(variant => (
        <Button
          key={variant}
          variant="filled"
          color={
            variant === 'info' || variant === 'warning' || variant === 'loading'
              ? 'primary'
              : variant
          }
          onPress={() =>
            createToast(variant, {
              closeButton,
              richColors,
              icon: variant === 'loading' ? undefined : icon,
              position,
            })
          }
        >
          Show {variant} toast
        </Button>
      ))}
      <Button
        variant="filled"
        onPress={() => {
          toast.action('Delete all the toasts', {
            action: {
              label: 'Delete',
              onClick: () => toasts.forEach(t => toast.dismiss(t.id)),
            },
          });
        }}
      >
        Show action toast
      </Button>
      <Button
        variant="filled"
        color="success"
        onPress={() => {
          toast.promise(
            (async () => {
              await new Promise(resolve => setTimeout(resolve, 1000));
              return 'Post';
            })(),
            {
              loading: 'Loading...',
              success: (data: string = 'Test') => {
                return `${data} has been successfully created`;
              },
              error: 'Post could not be created',
              closeButton,
              richColors,
              position,
            }
          );
        }}
      >
        Show successfull promise toast
      </Button>
      <Button
        variant="filled"
        color="error"
        onPress={() => {
          toast.promise(
            (async () => {
              await new Promise(resolve => setTimeout(resolve, 1000));
              throw new Error('Error');
            })(),
            {
              loading: 'Loading...',
              success: (data: string = 'Test') => {
                return `${data} has been successfully created`;
              },
              error: 'Post could not be created',
              closeButton,
              richColors,
              position,
            }
          );
        }}
      >
        Show unsuccessfull promise toast
      </Button>
    </Stack>
  );
}

type ToastOptionsProps = {
  closeButton?: boolean;
  richColors?: boolean;
  icon?: IconName;
  position?: ToasterProps['position'];
};

export const Default: Story = {
  render: args => <ToastOptions {...(args as ToastOptionsProps)} />,
};
