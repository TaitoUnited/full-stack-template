import { forwardRef, ReactNode, CSSProperties } from 'react';
import styled from 'styled-components';

import {
  useOverlay,
  useModal,
  useDialog,
  useFocusRing,
  mergeProps,
  OverlayContainer,
  DismissButton,
  FocusScope,
  VisuallyHidden,
} from 'react-aria';

import { focusRing } from '~utils/styled';

type Props = {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
  onClose: () => void;
};

// Based on https://react-spectrum.adobe.com/react-aria/useOverlayTrigger.html

const Popover = forwardRef<any, Props>(
  ({ title, children, onClose, ...otherProps }, ref: any) => {
    // Handle interacting outside the dialog and pressing the Escape key to close the modal
    const { overlayProps } = useOverlay(
      {
        onClose,
        isOpen: true, // Popover should be conditionally rendered so this can be `true`
        isDismissable: true,
      },
      ref
    );

    // Hide content outside the modal from screen readers
    const { modalProps } = useModal();

    // Get props for the dialog and its title
    const { dialogProps, titleProps } = useDialog({}, ref);

    const { isFocusVisible, focusProps } = useFocusRing();

    const wrapperProps = mergeProps(
      overlayProps,
      dialogProps,
      focusProps,
      otherProps,
      modalProps
    );

    return (
      <OverlayContainer>
        <FocusScope restoreFocus>
          <Wrapper {...wrapperProps} focused={isFocusVisible} ref={ref}>
            <VisuallyHidden>
              <h3 {...titleProps}>{title}</h3>
            </VisuallyHidden>
            {children}
            <DismissButton onDismiss={onClose} />
          </Wrapper>
        </FocusScope>
      </OverlayContainer>
    );
  }
);

Popover.displayName = 'Popover';

const Wrapper = styled.div<{ focused: boolean }>`
  outline: none;
  z-index: 1;
  position: absolute;
  box-shadow: ${p => p.theme.shadows.large};
  background-color: ${p => p.theme.colors.elevated};
  border-radius: ${p => p.theme.radii.normal}px;
  ${p => p.focused && focusRing}
`;

export default Popover;
