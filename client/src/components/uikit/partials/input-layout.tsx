import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode } from 'react';
import { Button, Label, type LabelProps } from 'react-aria-components';

import { css } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Popover } from '../popover';
import { Stack } from '../stack';
import {
  type CommonFormProps,
  DescriptionText,
  ErrorText,
  labelContainerStyles,
  labelStyles,
} from './common';
import { type ValidationParams } from './validation';

export function InputLayout({
  validation,
  children,
  label,
  labelProps,
  labelPosition,
  isRequired,
  description,
}: {
  validation: ValidationParams;
  children: ReactNode;
  label?: ReactNode;
  labelProps?: LabelProps;
  labelPosition?: CommonFormProps['labelPosition'];
  isRequired?: CommonFormProps['isRequired'];
  description?: CommonFormProps['description'];
  infoMessage?: CommonFormProps['infoMessage'];
}) {
  return (
    <>
      <div className={labelContainerStyles({ labelPosition: labelPosition })}>
        <Label
          {...labelProps}
          className={labelStyles}
          data-required={isRequired}
        >
          {label}
        </Label>

        <AnimatePresence mode="popLayout">
          {!!validation.message &&
            validation.type !== 'valid' &&
            validation.position === 'popover' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Popover
                  placement="top"
                  offset={6}
                  content={validation.message}
                  className={validationPopoverStyles}
                >
                  <ValidationDot type={validation.type} />
                </Popover>
              </motion.div>
            )}
        </AnimatePresence>

        {/* TODO: render info message */}
      </div>

      <Stack direction="column" gap="xs">
        {children}

        {(description ||
          (validation.message &&
            validation.position === 'below' &&
            validation.type !== 'valid')) && (
          <Stack direction="column" gap="xxs">
            {!!description && <DescriptionText>{description}</DescriptionText>}
            {!!validation.message && (
              <ErrorText>{validation.message}</ErrorText>
            )}
          </Stack>
        )}
      </Stack>
    </>
  );
}

const validationPopoverStyles = css({
  maxWidth: '400px',
  minWidth: '150px',
});

const ValidationDot = styled(Button, {
  base: {
    '--size': '16px',
    width: 'var(--size)',
    height: 'var(--size)',
    border: '4px solid',
    borderRadius: '50%',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    transformOrigin: 'center center',

    '&:hover': {
      transform: 'scale(1.5)',
    },
    '&:active': {
      opacity: 0.7,
    },
  },
  variants: {
    type: {
      error: {
        backgroundColor: '$error',
        borderColor: '$errorMuted',
      },
      warning: {
        backgroundColor: '$warn',
        borderColor: '$warnMuted',
      },
    },
  },
});
