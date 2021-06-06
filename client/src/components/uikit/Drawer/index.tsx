import { useRef, ReactNode, CSSProperties } from 'react';
import styled from 'styled-components';
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
      <Backdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <FocusScope contain restoreFocus autoFocus>
        <Wrapper
          {...wrapperProps}
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ ease: 'easeInOut', duration: 0.2 }}
          ref={ref}
        >
          <VisuallyHidden>
            <h3 {...titleProps}>{title}</h3>
          </VisuallyHidden>

          <Content>{children}</Content>
        </Wrapper>
      </FocusScope>
    </OverlayContainer>
  );
}

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: ${p => p.theme.colors.backdrop};
`;

const Wrapper = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;
  outline: none;
  min-width: 350px;
  background-color: ${p => p.theme.colors.elevated};
  box-shadow: ${p => p.theme.shadows.large};
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;
