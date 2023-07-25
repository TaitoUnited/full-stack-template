import { useRef, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

import {
  useOverlay,
  useModal,
  useDialog,
  useFocusRing,
  mergeProps,
  OverlayContainer,
  FocusScope,
  VisuallyHidden,
} from 'react-aria';

import { css } from '~styled-system/css';

type Props = {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
  onClose: () => void;
};

// Based on https://react-spectrum.adobe.com/react-aria/useDialog.html

export default function Drawer({ title, children, onClose, ...rest }: Props) {
  const ref = useRef<any>(null);
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, ref);
  const { focusProps } = useFocusRing();
  const { overlayProps } = useOverlay(
    { onClose, isOpen: true, isDismissable: true },
    ref
  );

  const wrapperProps = mergeProps(
    overlayProps,
    dialogProps,
    focusProps,
    rest,
    modalProps
  ) as any;

  return (
    <OverlayContainer>
      <motion.div
        className={backdropStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <FocusScope contain restoreFocus autoFocus>
        <motion.div
          {...wrapperProps}
          className={wrapperStyles}
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
          ref={ref}
        >
          <VisuallyHidden>
            <h3 {...titleProps}>{title}</h3>
          </VisuallyHidden>

          <motion.div className={contentStyles}>{children}</motion.div>
        </motion.div>
      </FocusScope>
    </OverlayContainer>
  );
}

const backdropStyles = css({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
  backgroundColor: '$backdrop',
});

const wrapperStyles = css({
  position: 'fixed',
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 1001,
  outline: 'none',
  minWidth: '350px',
  backgroundColor: '$elevated',
  boxShadow: '$large',
});

const contentStyles = css({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
});
