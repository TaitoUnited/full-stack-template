import { initGraphQLTada } from 'gql.tada';

import type { introspection } from './generated.d.ts';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  // Add custom scalars here
  scalars: {
    Date: string;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
