import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AnimatePresence, Variants, motion } from 'framer-motion';

import {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';

import {
  Dialog,
  ModalOverlay as AriaModalOverlay,
  Modal as AriaModal,
  OverlayTriggerStateContext,
  Heading,
} from 'react-aria-components';

import './styles.css';

import { Text } from '../Text';
import { IconButton } from '../Buttons/IconButton';
import { styled } from '~styled-system/jsx';

function ModalBase({
  children,
  isOpen,
  isDismissable = true,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  /**
   * Allows closing the modal by clicking on the overlay or pressing ESC.
   * Defaults to `true`.
   */
  isDismissable?: boolean;
  onClose: () => void;
}) {
  useLingui();

  return (
    <AnimatePresence data-test-id="modal-container">
      {isOpen && (
        /**
         * NOTE: the `key` is important for AnimatePresence to work correctly!
         * See: https://www.framer.com/motion/animate-presence/
         */
        <div key="modal">
          <ModalOverlay
            /**
             * Instead of controlling the open state via `isOpen` prop, the modal
             * should just be either rendered or not rendered by the parent.
             * This allows the whole modal to be code-split when needed.
             */
            isOpen={true}
            isDismissable={isDismissable}
            isKeyboardDismissDisabled={!isDismissable}
            onOpenChange={() => onClose()}
            data-test-id="modal-overlay"
          >
            {children}
          </ModalOverlay>
        </div>
      )}
    </AnimatePresence>
  );
}

function ModalContent({
  placement = 'middle',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /**
   * Where the modal should be placed.
   * Defaults to `middle`.
   */
  placement?: 'top' | 'middle' | 'bottom' | 'drawer';
}) {
  let variants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  if (placement === 'drawer') {
    variants = {
      hidden: {
        x: '100%',
        transition: { type: 'tween', duration: 0.15 },
      },
      visible: {
        x: 0,
        transition: { type: 'tween', duration: 0.2 },
      },
    };
  } else if (placement === 'top') {
    variants = {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    };
  } else if (placement === 'bottom') {
    variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };
  }

  return (
    <ModalPlacement
      placement={placement}
      data-test-id="modal-content"
      {...rest}
    >
      <ModalDialogContainer
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        kind={placement === 'drawer' ? 'drawer' : 'dialog'}
      >
        <ModalDialogContent>{children}</ModalDialogContent>
      </ModalDialogContainer>
    </ModalPlacement>
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
    throw new Error('ModalHeader requires either a `title` string or `children` element!');
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
      <IconButton label={t`Close`} icon="close" size={24} onClick={close} />
    </ModalHeaderContainer>
  );
}

function ModalBody(props: ComponentProps<typeof ModalBodyContainer>) {
  return <ModalBodyContainer data-test-id="modal-body" {...props} />;
}

function ModalFooter(props: ComponentProps<typeof ModalFooterContainer>) {
  return <ModalFooterContainer data-test-id="modal-footer" {...props} />;
}

const ModalOverlay = styled(AriaModalOverlay, {
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    minHeight: '100vh',
    minWidth: '100vw',
    backdropFilter: 'blur(4px)',
    animation: 'overlayAnimation 0.2s ease-in-out forwards',
  },
});

const ModalPlacement = styled(AriaModal, {
  base: {
    position: 'fixed',
    zIndex: 1001,
    mdDown: {
      width: '100%',
      maxWidth: 'calc(100vw - 32px)',
    },
  },
  variants: {
    placement: {
      middle: {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
      top: {
        left: '50%',
        top: '10%',
        transform: 'translate(-50%, 0)',
      },
      bottom: {
        left: '50%',
        bottom: '10%',
        transform: 'translate(-50%, 0)',
      },
      drawer: {
        top: 0,
        right: 0,
        bottom: 0,
        width: '90vw',
        maxWidth: '500px',
      },
    },
  },
});

const ModalDialogContainer = styled(motion.div, {
  base: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    kind: {
      dialog: {
        boxShadow: '$large',
        borderRadius: '$medium',
      },
      drawer: {
        height: '100%',
      },
    },
  },
});

const ModalDialogContent = styled(Dialog, {
  base: {
    outline: 'none',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$surface',
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
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
