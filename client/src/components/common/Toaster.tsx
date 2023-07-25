import { Toaster as HotToaster } from 'react-hot-toast';

import { cva } from '~styled-system/css';
import { Icon } from '~uikit';

export default function Toaster() {
  const styles = cva({
    base: {
      boxShadow: '$medium!',
      borderRadius: '$normal!',
      textStyle: '$body',
    },
    variants: {
      type: {
        info: { color: '$text!', background: '$elevated!' },
        success: { background: '$successMuted!', color: '$successText!' },
        error: { background: '$errorMuted!', color: '$errorText!' },
      },
    },
  });

  return (
    <HotToaster
      toastOptions={{
        duration: 50000,
        className: styles({ type: 'info' }),
        success: {
          icon: <Icon name="checkmark" size={24} color="successText" />,
          className: styles({ type: 'success' }),
        },
        error: {
          icon: <Icon name="x" size={24} color="errorText" />,
          className: styles({ type: 'error' }),
        },
      }}
    />
  );
}
