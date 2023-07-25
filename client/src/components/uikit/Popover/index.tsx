import { forwardRef, ReactNode, CSSProperties } from 'react';

import {
  useOverlay,
  useModal,
  useDialog,
  mergeProps,
  OverlayContainer,
  DismissButton,
  FocusScope,
  VisuallyHidden,
} from 'react-aria';

import { styled } from '~styled-system/jsx';

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

    const wrapperProps = mergeProps(
      overlayProps,
      dialogProps,
      otherProps,
      modalProps
    );

    return (
      <OverlayContainer>
        <FocusScope restoreFocus>
          <Wrapper {...wrapperProps} ref={ref}>
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

const Wrapper = styled('div', {
  base: {
    outline: 'none',
    zIndex: 1,
    position: 'absolute',
    boxShadow: '$large',
    backgroundColor: '$elevated',
    borderRadius: '$normal',
    $focusRing: '',
  },
});

export default Popover;
