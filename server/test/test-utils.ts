import { AuthenticatedGraphQLContext } from '~/setup/graphql/types';
import { log } from '~/src/utils/log';

/**
 * Create a GraphQL request context with the given user role and organisation for integration tests.
 * The returned context doesn't include the `auth`, `reply`, and `session` objects
 * as they are not needed for controller tests.
 */
export async function makeTestContext(options: {
  user: 'admin' | 'manager' | 'viewer';
}): Promise<AuthenticatedGraphQLContext> {
  const db = globalThis.testDb;
  const user = globalThis.testData.users[options.user || 'admin'];

  const context: AuthenticatedGraphQLContext = {
    log,
    db,
    requestId: 'test-request-id',
    user: { id: user.id },
    organisationId: globalThis.testData.organisation.id,
    userOrganisations: [
      {
        id: globalThis.testData.organisation.id,
        role: user.role,
      },
    ],
    originApi: 'graphql',
    // We don't need to mock these for controller tests
    session: {} as any,
    auth: {} as any,
    reply: {} as any,
  };

  return context;
}
