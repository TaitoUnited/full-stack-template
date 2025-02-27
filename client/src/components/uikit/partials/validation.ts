import type { CommonFormProps } from './common';

export function getValidationParams(
  validationMessage?: CommonFormProps['validationMessage']
) {
  return {
    message: getValidationMessage(validationMessage),
    position: getValidationPosition(validationMessage),
    type: getValidationType(validationMessage),
  };
}

export type ValidationParams = ReturnType<typeof getValidationParams>;

function getValidationMessage(
  validation?: CommonFormProps['validationMessage']
) {
  if (!validation) return;
  if (typeof validation === 'string') return validation;
  return validation.message;
}

function getValidationPosition(
  validation?: CommonFormProps['validationMessage']
): 'below' | 'popover' {
  if (!validation) return 'below';
  if (typeof validation === 'string') return 'below';
  return validation.position;
}

function getValidationType(
  validation?: CommonFormProps['validationMessage']
): 'valid' | 'error' | 'warning' {
  if (!validation) return 'valid';
  if (typeof validation === 'string') return 'error';
  return validation.type;
}
