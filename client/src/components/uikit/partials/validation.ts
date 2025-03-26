import type { CommonFormProps } from './common';

export function getValidationParams(
  validationMessage?: CommonFormProps['validationMessage']
) {
  return {
    message: getValidationMessage(validationMessage),
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

function getValidationType(
  validation?: CommonFormProps['validationMessage']
): 'valid' | 'error' | 'warning' {
  if (!validation) return 'valid';
  if (typeof validation === 'string') return 'error';
  return validation.type;
}
