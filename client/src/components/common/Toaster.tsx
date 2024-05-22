import { Toaster as HotToaster } from 'react-hot-toast';

import { cva } from '~styled-system/css';
import { Icon } from '~uikit';

export default function Toaster() {
  const styles = cva({
    base: {
      boxShadow: '$medium!',
      borderRadius: '$regular!',
      textStyle: '$body',
    },
    variants: {
      type: {
        info: { color: '$text!', background: '$surface!' },
        success: { background: '$successMuted!', color: '$successContrast!' },
        error: { background: '$errorMuted!', color: '$successContrast!' },
      },
    },
  });

  return (
    <HotToaster
      toastOptions={{
        duration: 50000,
        className: styles({ type: 'info' }),
        success: {
          icon: <Icon name="check" size={24} color="successContrast" />,
          className: styles({ type: 'success' }),
        },
        error: {
          icon: <Icon name="close" size={24} color="errorContrast" />,
          className: styles({ type: 'error' }),
        },
      }}
    />
  );
}
