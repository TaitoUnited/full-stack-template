import { useLingui } from '@lingui/react/macro';
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  use,
} from 'react';
import {
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  Heading,
  OverlayTriggerStateContext,
} from 'react-aria-components';

import { cva } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import './styles.css';

import { IconButton } from '../icon-button';
import { Text } from '../text';

function DialogBase({
  children,
  isOpen,
  placement = 'middle',
  isDismissable = true,
  onOpenChange,
}: {
  children: ReactNode;
  isOpen: boolean;
  /**
   * Allows closing the dialog by clicking on the overlay or pressing ESC.
   * Defaults to `true`.
   */
  isDismissable?: boolean;
  /**
   * Where the dialog should be placed.
   * Defaults to `middle`.
   */
  placement?: 'top' | 'middle' | 'bottom' | 'drawer';
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <AriaModalOverlay
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      data-testid="dialog-overlay"
      className={({ isEntering, isExiting }) =>
        dialogOverlayStyles({ isEntering, isExiting })
      }
    >
      <AriaModal
        data-testid="dialog-container"
        className={({ isEntering, isExiting }) =>
          dialogModalStyles({ placement, isEntering, isExiting })
        }
      >
        <DialogContainer>{children}</DialogContainer>
      </AriaModal>
    </AriaModalOverlay>
  );
}

function DialogHeader({
  title,
  children,
  ...rest
}: ComponentProps<typeof DialogHeaderContainer> & {
  title?: string;
  children?: ReactElement;
}) {
  const { t } = useLingui();
  const triggerState = use(OverlayTriggerStateContext);

  if (!title && !children) {
    throw new Error(
      'DialogHeader requires either a `title` string or `children` element!'
    );
  }

  return (
    <DialogHeaderContainer data-testid="dialog-header" {...rest}>
      <Heading slot="title">
        {title ? (
          <Text variant="headingM" as="span">
            {title}
          </Text>
        ) : (
          children
        )}
      </Heading>
      <IconButton
        label={t`Close`}
        icon="close"
        size={32}
        onPress={() => triggerState?.close()}
      />
    </DialogHeaderContainer>
  );
}

function DialogBody(props: ComponentProps<typeof DialogBodyContainer>) {
  return <DialogBodyContainer data-testid="dialog-body" {...props} />;
}

function DialogFooter(props: ComponentProps<typeof DialogFooterContainer>) {
  return <DialogFooterContainer data-testid="dialog-footer" {...props} />;
}

const dialogOverlayStyles = cva({
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
        animation: 'dialog-overlay-animation 150ms ease-out forwards',
      },
    },
    isExiting: {
      true: {
        animation: 'dialog-overlay-animation 100ms ease-in reverse',
      },
    },
  },
});

const dialogModalStyles = cva({
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
        '--animation': 'dialog-middle-animation',
        left: '50%',
        top: '50%',
        translate: '-50% -50%',
      },
      top: {
        '--animation': 'dialog-top-animation',
        left: '50%',
        top: '10%',
        translate: '-50% 0px',
      },
      bottom: {
        '--animation': 'dialog-bottom-animation',
        left: '50%',
        bottom: '10%',
        translate: '-50% 0px',
      },
      drawer: {
        '--animation': 'dialog-drawer-animation',
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

const DialogContainer = styled(AriaDialog, {
  base: {
    outline: 'none',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});

const DialogHeaderContainer = styled('div', {
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

const DialogBodyContainer = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '$medium',
    position: 'relative',
  },
});

const DialogFooterContainer = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingInline: '$medium',
    paddingBottom: '$medium',
  },
});

// Add compound components to Dialog
export const Dialog = Object.assign(DialogBase, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
});
