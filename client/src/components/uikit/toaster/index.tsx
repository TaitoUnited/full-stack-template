/* eslint-disable no-restricted-imports */
import {
  toast as sonnerToast,
  Toaster as SonnerToaster,
  type ToasterProps,
} from 'sonner';

import { type ColorToken } from '~/styled-system/tokens';
import { type StyledSystemToken } from '~/utils/styled-system';

import { Icon, type IconName } from '../icon';

export type ToasterOptions = ToasterProps & {
  icon?: IconName;
  iconColor?: StyledSystemToken<ColorToken> | 'currentColor';
};

// Customize global toast options here
const toastOptions: ToasterProps = {
  position: 'bottom-right',
  duration: 3000 /** 3 seconds */,
};

export function Toaster() {
  return (
    <SonnerToaster
      richColors /** Remove this if you don't want rich colors */
      toastOptions={toastOptions}
    />
  );
}

function defaultOptions(options: ToasterOptions | undefined) {
  return {
    ...options,
    icon: options?.icon ? (
      <Icon
        name={options.icon}
        color={options.iconColor || 'currentColor'}
        size={24}
      />
    ) : undefined,
  };
}

// You can customize each toasts by updating these to your needs
export const toast = Object.assign(
  (message: string, options?: ToasterOptions) => sonnerToast(message, options),
  {
    success: (message: string, options?: ToasterOptions) =>
      sonnerToast.success(message, defaultOptions(options)),
    error: (message: string, options?: ToasterOptions) =>
      sonnerToast.error(message, defaultOptions(options)),
    info: (message: string, options?: ToasterOptions) =>
      sonnerToast.info(message, defaultOptions(options)),
    warning: (message: string, options?: ToasterOptions) =>
      sonnerToast.warning(message, defaultOptions(options)),
    loading: (message: string, options?: ToasterOptions) =>
      sonnerToast.loading(message, options), // Custom icon with loading state does not work, so we prevent it here
    dismiss: (id: string | number) => sonnerToast.dismiss(id),
    promise: toastPromise,
    action: toastAction,
  }
);

function toastPromise<T>(
  promise: Promise<T>,
  options: ToasterOptions & {
    loading: string;
    success: (data: T) => string;
    error: string;
  }
) {
  const { loading, success, error, ...rest } = options;

  return sonnerToast.promise(promise, {
    loading: loading,
    success: data => success(data),
    error: error,
    ...defaultOptions({ ...rest }),
    icon: undefined, // Custom icon with loading state does not work, so we prevent it here
  });
}

type ActionToasterOptions = ToasterOptions & {
  action: { label: string; onClick: () => void };
};

function toastAction(message: string, options?: ActionToasterOptions) {
  return sonnerToast(message, options);
}
