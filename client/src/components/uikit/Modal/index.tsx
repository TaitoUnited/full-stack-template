import { useRef, ReactNode, CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';

import {
  useOverlay,
  useModal,
  useDialog,
  useFocusRing,
  usePreventScroll,
  mergeProps,
  OverlayContainer,
  FocusScope,
  FocusRing,
  VisuallyHidden,
} from 'react-aria';

import Icon from '../Icon';

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
  const { isFocusVisible, focusProps } = useFocusRing();
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

  usePreventScroll();

  return (
    <OverlayContainer>
      <Backdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FocusScope contain restoreFocus autoFocus>
          <Wrapper
            {...wrapperProps}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: -15 }}
            ref={ref}
          >
            <VisuallyHidden>
              <h3 {...titleProps}>{title}</h3>
            </VisuallyHidden>

            <Content>
              {children}

              {showCloseButton && (
                <FocusRing focusRingClass="modal-close-button-focus">
                  <CloseButton onClick={onClose}>
                    <Icon icon={MdClose} size={14} color="text" />
                  </CloseButton>
                </FocusRing>
              )}
            </Content>

            <ContentBackground layout focused={isFocusVisible} />
          </Wrapper>
        </FocusScope>
      </Backdrop>
    </OverlayContainer>
  );
}

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled(motion.div)`
  outline: none;
  position: relative;
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

const ContentBackground = styled(motion.div)<{ focused: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-color: ${p => p.theme.colors.surface};
  border-radius: ${p => p.theme.radii.normal}px;
  ${p => p.theme.shadows.large}

  ${p =>
    p.focused &&
    css`
      box-shadow: 0px 0px 0px 2px ${p => p.theme.colors.primary};
    `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  transition: transform 100ms ease;

  &.modal-close-button-focus {
    box-shadow: 0px 0px 0px 2px ${p => p.theme.colors.primary};
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;
