import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ComponentProps, ReactElement, ReactNode, useContext } from 'react';

import {
  Dialog,
  ModalOverlay,
  Modal as AriaModal,
  OverlayTriggerStateContext,
  Heading,
} from 'react-aria-components';

import './styles.css';
import { Text } from '../Text';
import { IconButton } from '../IconButton';
import { styled } from '~styled-system/jsx';
import { cva } from '~styled-system/css';

function ModalBase({
  children,
  isOpen,
  placement = 'middle',
  isDismissable = true,
  onOpenChange,
}: {
  children: ReactNode;
  isOpen: boolean;
  /**
   * Allows closing the modal by clicking on the overlay or pressing ESC.
   * Defaults to `true`.
   */
  isDismissable?: boolean;
  /**
   * Where the modal should be placed.
   * Defaults to `middle`.
   */
  placement?: 'top' | 'middle' | 'bottom' | 'drawer';
  onOpenChange: (isOpen: boolean) => void;
}) {
  useLingui();

  return (
    <ModalOverlay
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      data-test-id="modal-overlay"
      className={({ isEntering, isExiting }) =>
        modalOverlayStyles({ isEntering, isExiting })
      }
    >
      <AriaModal
        data-test-id="modal-container"
        className={({ isEntering, isExiting }) =>
          modalStyles({ placement, isEntering, isExiting })
        }
      >
        <ModalDialog>{children}</ModalDialog>
      </AriaModal>
    </ModalOverlay>
  );
}

function ModalHeader({
  title,
  children,
  ...rest
}: ComponentProps<typeof ModalHeaderContainer> & {
  title?: string;
  children?: ReactElement;
}) {
  const { close } = useContext(OverlayTriggerStateContext);

  if (!title && !children) {
    throw new Error(
      'ModalHeader requires either a `title` string or `children` element!'
    );
  }

  return (
    <ModalHeaderContainer data-test-id="modal-header" {...rest}>
      <Heading slot="title">
        {title ? (
          <Text variant="headingM" as="span">
            {title}
          </Text>
        ) : (
          children
        )}
      </Heading>
      <IconButton label={t`Close`} icon="close" size={24} onPress={close} />
    </ModalHeaderContainer>
  );
}

function ModalBody(props: ComponentProps<typeof ModalBodyContainer>) {
  return <ModalBodyContainer data-test-id="modal-body" {...props} />;
}

function ModalFooter(props: ComponentProps<typeof ModalFooterContainer>) {
  return <ModalFooterContainer data-test-id="modal-footer" {...props} />;
}

const modalOverlayStyles = cva({
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    minHeight: '100vh',
    minWidth: '100vw',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  variants: {
    isEntering: {
      true: {
        animation: 'modal-overlay-animation 150ms ease-out forwards',
      },
    },
    isExiting: {
      true: {
        animation: 'modal-overlay-animation 100ms ease-in reverse',
      },
    },
  },
});

const modalStyles = cva({
  base: {
    position: 'fixed',
    zIndex: 1001,
    boxShadow: '$large',
    borderRadius: '$medium',
    backgroundColor: '$surface',

    mdDown: {
      width: '100%',
      maxWidth: 'calc(100vw - 32px)',
    },
  },
  variants: {
    isEntering: {
      true: {
        animation: 'var(--animation) 150ms ease-out forwards',
      },
    },
    isExiting: {
      true: {
        animation: 'var(--animation) 100ms ease-out reverse',
      },
    },
    placement: {
      middle: {
        '--animation': 'modal-middle-animation',
        left: '50%',
        top: '50%',
        translate: '-50% -50%',
      },
      top: {
        '--animation': 'modal-top-animation',
        left: '50%',
        top: '10%',
        translate: '-50% 0px',
      },
      bottom: {
        '--animation': 'modal-bottom-animation',
        left: '50%',
        bottom: '10%',
        translate: '-50% 0px',
      },
      drawer: {
        '--animation': 'modal-drawer-animation',
        top: '0px',
        right: '0px',
        bottom: '0px',
        width: '90vw',
        maxWidth: '500px',
        height: '100%',
        borderRadius: '0px',
      },
    },
  },
});

const ModalDialog = styled(Dialog, {
  base: {
    outline: 'none',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});

const ModalHeaderContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '$small',
    justifyContent: 'space-between',
    paddingLeft: '$medium',
    paddingRight: '$small', // take close button into account
    paddingTop: '$regular',
  },
});

const ModalBodyContainer = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '$medium',
    position: 'relative',
  },
});

const ModalFooterContainer = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingInline: '$medium',
    paddingBottom: '$medium',
  },
});

// Add compound components to Modal
export const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
