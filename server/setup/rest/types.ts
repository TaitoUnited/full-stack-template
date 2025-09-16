import type { FastifyRequest, RouteGenericInterface } from 'fastify';

import type { NonNullableFields } from '~/src/utils/types';
import type { Context } from '../context';

export type AuthenticatedRestContext = NonNullableFields<
  Context,
  '__authenticator__'
>;

export type AuthenticatedRESTRequest<T extends RouteGenericInterface> =
  FastifyRequest<T> & {
    ctx: AuthenticatedRestContext;
  };
