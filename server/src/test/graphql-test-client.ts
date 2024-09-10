import { GraphQLClient } from 'graphql-request';
import { initGraphQLTada } from 'gql.tada';

import type { introspection } from './graphql-test-env';
import { config } from '~/utils/config';

export const graphql = initGraphQLTada<{ introspection: introspection }>();
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';

const baseUrl =
  process.env.TEST_API_URL ||
  `http://${config.API_BINDADDR}:${config.API_PORT}/graphql`;

export const client = new GraphQLClient(baseUrl);

export function clientWithUser(
  user: keyof (typeof globalThis.testData)['users']
) {
  const { sessionId } = globalThis.testData.users[user];

  return new GraphQLClient(baseUrl, {
    headers: {
      Authorization: `Bearer ${sessionId}`,
      'x-organisation-id': globalThis.testData.organisation.id,
    },
  });
}
