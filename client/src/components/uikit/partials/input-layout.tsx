import { type ReactNode } from 'react';
import { Label, type LabelProps } from 'react-aria-components';

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
      </div>

      <Stack direction="column" gap="xs">
        {children}

        {(description ||
          (validation.message && validation.type !== 'valid')) && (
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
