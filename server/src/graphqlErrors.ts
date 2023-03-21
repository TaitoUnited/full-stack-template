import { ArgumentValidationError } from 'type-graphql';
import { unwrapResolverError } from '@apollo/server/errors';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import type { ValidationError as ClassValidatorValidationError } from 'class-validator';

export const errorCodes = {
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  BAD_USER_INPUT: 'BAD_USER_INPUT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export const InternalError = (message?: string) =>
  new GraphQLError(message ?? 'Internal server error', {
    extensions: {
      code: errorCodes.INTERNAL_SERVER_ERROR,
    },
  });

export const NotAuthorizedError = (message?: string) =>
  new GraphQLError(message ?? 'Not authorized', {
    extensions: {
      code: errorCodes.NOT_AUTHORIZED,
    },
  });

export const UnauthenticatedError = (message?: string) =>
  new GraphQLError(message ?? 'Unauthenticated', {
    extensions: {
      code: errorCodes.UNAUTHENTICATED,
    },
  });

export const BadUserInputError = (message?: string) =>
  new GraphQLError(message ?? 'Too long or otherwise invalid input', {
    extensions: {
      code: errorCodes.BAD_USER_INPUT,
    },
  });

export function customFormatError(
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError {
  let returnedError = formattedError;
  const originalError = unwrapResolverError(error);

  // Validation
  if (originalError instanceof ArgumentValidationError) {
    returnedError = new CustomValidationError(originalError.validationErrors);
  }

  return {
    message:
      returnedError.extensions?.code === errorCodes.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : returnedError.message,

    extensions: {
      code: returnedError.extensions?.code,
      validationErrors: JSON.stringify(
        returnedError.extensions?.validationErrors
      ),
    },
  };
}

type IValidationError = Pick<
  ClassValidatorValidationError,
  'property' | 'value' | 'constraints' | 'children'
>;

function formatValidationErrors(
  validationError: IValidationError
): IValidationError {
  return {
    property: validationError.property,
    ...(validationError.value && { value: validationError.value }),
    ...(validationError.constraints && {
      constraints: validationError.constraints,
    }),
    ...(validationError.children &&
      validationError.children.length !== 0 && {
        children: validationError.children.map((child) =>
          formatValidationErrors(child)
        ),
      }),
  };
}

export class CustomValidationError extends GraphQLError {
  public constructor(validationErrors: ClassValidatorValidationError[]) {
    super('Validation Error', {
      extensions: {
        code: errorCodes.BAD_USER_INPUT,
        validationErrors: validationErrors.map((validationError) =>
          formatValidationErrors(validationError)
        ),
        ...validationErrors,
      },
    });

    Object.setPrototypeOf(this, CustomValidationError.prototype);
  }
}
