import type {
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from 'fastify';

import type { NonNullableFields } from '~/src/utils/types';

export type GraphQlContext = FastifyRequest['ctx'] & {
  reply: FastifyReply;
};

/** GraphQL context that has been authenticated. */
export type AuthenticatedGraphQLContext = NonNullableFields<
  GraphQlContext,
  'user' | '__authenticator__'
>;

export type AuthenticatedGraphQLRequest<T extends RouteGenericInterface> =
  FastifyRequest<T> & { ctx: AuthenticatedGraphQLContext };
