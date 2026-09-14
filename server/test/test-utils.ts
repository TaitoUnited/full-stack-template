/* oxlint-disable typescript/no-unnecessary-condition typescript/no-unsafe-assignment typescript/no-unsafe-type-assertion */

import type { AuthenticatedGraphQLContext } from '~/setup/graphql/types';
import type { DrizzleDb } from '~/db';
import { getAuth } from '~/src/utils/authentication';
import { log } from '~/src/utils/log';

/**
 * Creates an authenticated GraphQL context backed by the integration-test
 * database. Transport-only reply behavior is intentionally not configured.
 */
export function makeTestContext(options: {
  db: DrizzleDb;
  user: 'admin' | 'manager' | 'viewer';
}): AuthenticatedGraphQLContext {
  const user = globalThis.testData.users[options.user];

  const context: AuthenticatedGraphQLContext = {
    log,
    db: options.db,
    requestId: 'test-request-id',
    user: { id: user.id },
    initiator: 'graphql',
    auth: getAuth(options.db),
    reply: {} as any,
    error: null,
    __authenticator__: 'test',
  };

  return context;
}
