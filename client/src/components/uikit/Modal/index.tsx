import { useRef, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

import {
  useOverlay,
  useModal,
  useDialog,
  usePreventScroll,
  mergeProps,
  OverlayContainer,
  FocusScope,
  FocusRing,
  VisuallyHidden,
} from 'react-aria';

import Icon from '../Icon';
import { css } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

type Props = {
  title: string;
  children: ReactNode;
  showCloseButton?: boolean;
  style?: CSSProperties;
  onClose: () => void;
};

// Based on https://react-spectrum.adobe.com/react-aria/useDialog.html

export default function Modal({
  title,
  children,
  onClose,
  showCloseButton,
  ...rest
}: Props) {
  const ref = useRef<any>(null);
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, ref);
  const { overlayProps } = useOverlay(
    { onClose, isOpen: true, isDismissable: true },
    ref
  );

  const wrapperProps = mergeProps(
    overlayProps,
    dialogProps,
    rest,
    modalProps
  ) as any;

  usePreventScroll();

  return (
    <OverlayContainer>
      <motion.div
        className={backdropStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FocusScope contain restoreFocus autoFocus>
          <motion.div
            {...wrapperProps}
            className={wrapperStyles}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: -15 }}
            ref={ref}
          >
            <VisuallyHidden>
              <h3 {...titleProps}>{title}</h3>
            </VisuallyHidden>

            <motion.div className={contentStyles}>
              {children}

              {showCloseButton && (
                <FocusRing focusRingClass="modal-close-button-focus">
                  <CloseButton onClick={onClose}>
                    <Icon name="x" size={14} color="text" />
                  </CloseButton>
                </FocusRing>
              )}
            </motion.div>

            <motion.div className={contentBackgroundStyles} layout />
          </motion.div>
        </FocusScope>
      </motion.div>
    </OverlayContainer>
  );
}

const backdropStyles = css({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 999,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const wrapperStyles = css({
  outline: 'none',
  position: 'relative',
});

const contentStyles = css({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const contentBackgroundStyles = css({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: -1,
  backgroundColor: '$surface',
  borderRadius: '$normal',
  boxShadow: '$large',
});

const CloseButton = styled('button', {
  base: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 1,
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    outline: 'none',
    transition: 'transform 100ms ease',

    '&.modal-close-button-focus': {
      $focusRing: '',
    },

    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },

    '&:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
});
