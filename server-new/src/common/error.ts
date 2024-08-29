import { GraphQLError as BaseGraphQLError } from 'graphql';

export const errorCodes = {
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  BAD_USER_INPUT: 'BAD_USER_INPUT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export const GraphQLError = {
  internal: (message = 'Internal server error') =>
    new BaseGraphQLError(message, {
      extensions: {
        code: errorCodes.INTERNAL_SERVER_ERROR,
      },
    }),
  unauthorized: (message = 'Not authorized') =>
    new BaseGraphQLError(message, {
      extensions: {
        code: errorCodes.NOT_AUTHORIZED,
      },
    }),
  unauthenticated: (message = 'Unauthenticated') =>
    new BaseGraphQLError(message, {
      extensions: {
        code: errorCodes.UNAUTHENTICATED,
      },
    }),
  userInput: (message = 'Invalid input') =>
    new BaseGraphQLError(message, {
      extensions: {
        code: errorCodes.BAD_USER_INPUT,
      },
    }),
};
