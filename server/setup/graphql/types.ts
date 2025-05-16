import { FastifyReply, FastifyRequest } from 'fastify';

import { NonNullableFields } from '~/src/utils/types';

export type GraphQlContext = FastifyRequest['ctx'] & {
  reply: FastifyReply;
};

export type AuthenticatedGraphQLContext = NonNullableFields<
  GraphQlContext,
  'user' | 'session'
>;
