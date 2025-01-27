import { type ReactNode, useEffect } from 'react';
import {
  Dialog as AriaDialog,
  Heading as AriaHeading,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from 'react-aria-components';
import { create } from 'zustand';

import { css } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Button, type ButtonProps } from '../button';

type AlertDialogButton = {
  text: string;
  color: ButtonProps['color'];
  variant: ButtonProps['variant'];
  testId?: string;
  onPress?: () => void;
};

type AlertDialogProps = {
  title: string;
  content: ReactNode;
  buttons: AlertDialogButton[];
};

export function AlertDialog({ title, content, buttons }: AlertDialogProps) {
  return (
    <AriaModalOverlay
      isOpen
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      onOpenChange={() => alertDialogStore.setState({ dialog: null })} // when ESC is pressed
      className={dialogOverlayStyles}
      data-testid="alert-dialog-overlay"
    >
      <AriaModal
        data-testid="alert-dialog-container"
        className={dialogModalStyles}
      >
        <AriaDialog role="alertdialog" className={dialogStyles}>
          <DialogHeader data-testid="alert-dialog-header">
            <AriaHeading className={dialogHeadingStyles} slot="title">
              {title}
            </AriaHeading>
          </DialogHeader>

          <DialogBody data-testid="alert-dialog-body">{content}</DialogBody>

          <DialogFooter data-testid="alert-dialog-footer">
            {buttons.map(({ color, text, variant, testId, onPress }) => (
              <Button
                key={text}
                color={color}
                variant={variant}
                data-testid={testId}
                onPress={() => {
                  onPress?.();
                  alertDialogStore.setState({ dialog: null });
                }}
              >
                {text}
              </Button>
            ))}
          </DialogFooter>
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

const alertDialogStore = create<{ dialog: null | AlertDialogProps }>(() => ({
  dialog: null,
}));

const useAlertDialogStore = alertDialogStore;

export function AlertDialogProvider() {
  const { dialog } = useAlertDialogStore();

  if (!dialog) {
    return null;
  }

  return <AlertDialog {...dialog} />;
}

export function useAlertDialog() {
  function show(options: AlertDialogProps) {
    alertDialogStore.setState({ dialog: options });
  }

  function hide() {
    alertDialogStore.setState({ dialog: null });
  }

  // Fail-safe in case the component unmounts without hiding the dialog
  useEffect(() => {
    return () => {
      hide();
    };
  }, []);

  return { show, hide };
}

const dialogOverlayStyles = css({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  minHeight: '100vh',
  minWidth: '100vw',
  backdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  transition: 'opacity 300ms',

  '&[data-entering], &[data-exiting]': {
    opacity: 0,
  },
});

const dialogModalStyles = css({
  position: 'fixed',
  zIndex: 1001,
  boxShadow: '$large',
  borderRadius: '$medium',
  backgroundColor: '$surface',
  left: '50%',
  top: '50%',
  translate: '-50% -50%',
  transition: 'opacity 300ms, transform 300ms',

  '&[data-entering]': {
    opacity: 0,
    transform: 'scale(0.9)',
  },

  mdDown: {
    width: '100%',
    maxWidth: 'calc(100vw - {$spacing.large})',
  },
});

const dialogStyles = css({
  minWidth: '300px',
  outline: 'none',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '$regular',
});

const dialogHeadingStyles = css({
  textStyle: '$headingM',
  lineHeight: 1,
});

const DialogHeader = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '$small',
    justifyContent: 'space-between',
  },
});

const DialogBody = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '$regular',
    paddingBottom: '$medium',
    position: 'relative',
  },
});

const DialogFooter = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '$small',
  },
});
