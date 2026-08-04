/* oxlint-disable node/no-process-env */

import { GraphQLClient } from 'graphql-request';
import { initGraphQLTada } from 'gql.tada';

import type { introspection } from './graphql-test-env';
import { config } from '~/src/utils/config';

export const graphql = initGraphQLTada<{ introspection: introspection }>();
export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';

const testBaseUrl = process.env.TEST_BASE_URL;
const baseUrl = testBaseUrl
  ? `${testBaseUrl}/api/graphql`
  : `http://${config.API_BINDADDR}:${config.API_PORT}/graphql`;
// An empty test URL should use the configured application URL.
/* oxlint-disable typescript/prefer-nullish-coalescing */
const origin = testBaseUrl ? testBaseUrl : config.COMMON_URL!;
/* oxlint-enable typescript/prefer-nullish-coalescing */

export const client = new GraphQLClient(baseUrl, {
  headers: { origin },
});

export function clientWithUser(
  user: keyof (typeof globalThis.testData)['users']
) {
  const { sessionId } = globalThis.testData.users[user];

  return new GraphQLClient(baseUrl, {
    headers: {
      Authorization: `Bearer ${sessionId}`,
      'x-organisation-id': globalThis.testData.organisation.id,
      origin,
    },
  });
}
