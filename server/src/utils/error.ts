import { GraphQLError as GraphQLErrorBase } from 'graphql';

// GraphQL error
export const GraphQLError = {
  badRequest: (message = 'Bad request') =>
    new GraphQLErrorBase(message, {
      extensions: { code: 'BAD_REQUEST', status: 400 },
    }),
  unauthorized: (message = 'Unauthorized') =>
    new GraphQLErrorBase(message, {
      extensions: { code: 'UNAUTHORIZED', status: 401 },
    }),
  forbidden: (message = 'Forbidden') =>
    new GraphQLErrorBase(message, {
      extensions: { code: 'FORBIDDEN', status: 403 },
    }),
  conflict: (message = 'Conflict') =>
    new GraphQLErrorBase(message, {
      extensions: { code: 'CONFLICT', status: 409 },
    }),
  internal: (message = 'Internal server error') =>
    new GraphQLErrorBase(message, {
      extensions: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
    }),
};

// REST API error

// TODO: rename this to eg. `ApiError` if your project only uses REST API
export class ApiRouteErrorBase extends Error {
  status: number;
  data?: Record<string, any>;

  constructor(options: {
    status: number;
    message: string;
    data?: Record<string, any>;
  }) {
    super();
    this.name = 'ApiRouteError';
    this.status = options.status;
    this.message = options.message;
    this.data = options.data;
  }
}

export const ApiRouteError = {
  badRequest: (message = 'Bad request', data?: Record<string, any>) =>
    new ApiRouteErrorBase({
      status: 400,
      message,
      data,
    }),
  unauthorized: (message = 'Unauthorized', data?: Record<string, any>) =>
    new ApiRouteErrorBase({
      status: 401,
      message,
      data,
    }),
  forbidden: (message = 'Forbidden', data?: Record<string, any>) =>
    new ApiRouteErrorBase({
      status: 403,
      message,
      data,
    }),
  notFound: (message = 'Not found', data?: Record<string, any>) =>
    new ApiRouteErrorBase({
      status: 404,
      message,
      data,
    }),
  conflict: (message = 'Conflict', data?: Record<string, any>) =>
    new ApiRouteErrorBase({
      status: 409,
      message,
      data,
    }),
  internal: (message = 'Internal server error', data?: Record<string, any>) =>
    new ApiRouteErrorBase({
      status: 500,
      message,
      data,
    }),
};
