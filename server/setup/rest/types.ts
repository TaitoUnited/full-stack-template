import type { FastifyRequest, RouteGenericInterface } from 'fastify';

import type { NonNullableFields } from '~/src/utils/types';
import type { Context } from '../context';

export type AuthenticatedRestContext = NonNullableFields<
  Context,
  'user' | 'session'
>;

export type AuthenticatedRESTRequest<T extends RouteGenericInterface> =
  FastifyRequest<T> & {
    ctx: AuthenticatedRestContext;
  };
