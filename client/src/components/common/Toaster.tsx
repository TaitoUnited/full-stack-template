import { Toaster as HotToaster } from 'react-hot-toast';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { useTheme } from 'styled-components';

import { Icon } from '~uikit';

export default function Toaster() {
  const theme = useTheme();

  return (
    <HotToaster
      toastOptions={{
        style: {
          padding: theme.spacing.normal,
          color: theme.colors.text,
          background: theme.colors.elevated,
          boxShadow: theme.shadows.medium,
          borderRadius: theme.radii.normal,
          ...theme.typography.body,
        },
        success: {
          icon: <Icon icon={HiCheckCircle} size={24} color="currentColor" />,
          style: {
            backgroundColor: theme.colors.successMuted,
            color: theme.colors.successText,
          },
        },
        error: {
          icon: <Icon icon={HiXCircle} size={24} color="currentColor" />,
          style: {
            backgroundColor: theme.colors.errorMuted,
            color: theme.colors.errorText,
          },
        },
      }}
    />
  );
}
