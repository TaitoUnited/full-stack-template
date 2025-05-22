import { NonNullableFields } from '~/src/utils/types';
import { GraphQlContext } from './server';

export type AuthenticatedGraphQLContext = NonNullableFields<
  GraphQlContext,
  'user' | 'session'
>;
