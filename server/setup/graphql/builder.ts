import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

import { type GraphQlContext } from './server';
import { hasValidOrganisation } from '~/src/utils/authorisation';
import { hasValidSession } from '~/src/utils/authentication';
import { GraphQLError } from '~/src/utils/error';

export const builder = new SchemaBuilder<{
  Context: GraphQlContext;
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
  AuthScopes: {
    authenticated: boolean;
    session: boolean;
    organisation: boolean;
  };
  AuthContexts: {
    authenticated: AuthContext<'user' | 'session' | 'organisationId'>;
    session: AuthContext<'user' | 'session'>;
    organisation: AuthContext<'organisationId'>;
  };
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
}>({
  plugins: [SimpleObjectsPlugin, ScopeAuthPlugin],
  /**
   * Fields are NOT nullable by default.
   * In most cases, you want to be explicit about what fields can be null.
   * Having every field be nullable by default makes it very difficult to use
   * the data from the API without checking for null everywhere on the client.
   */
  defaultFieldNullability: false,
  /**
   * Input fields and arguments ARE required by default.
   * This makes it easier to define common input arguments like IDs without
   * needing to specify `required: true` every time. Some input arguments like
   * search queries may not be required, so you can override this behavior by
   * setting `required: false` on the input argument.
   */
  defaultInputFieldRequiredness: true,
  scopeAuth: {
    /**
     * Reply with our custom GraphQLError when a user is not authenticated.
     * If you have more complex auth scopes, you can customize the returned
     * error based on args: `parent`, `context`, `info`, `result`, see docs:
     * https://pothos-graphql.dev/docs/plugins/scope-auth#customizing-error-messages
     */
    unauthorizedError: () => GraphQLError.unauthorized(),

    /**
     * Recommended when using subscriptions. When this is not set, auth checks
     * are run when event is resolved rather than when the subscription is created.
     */
    authorizeOnSubscribe: true,

    /**
     * Create the scopes and scope loaders for each request.
     * You can add more nuanced scopes here, eg. based on user roles or permissions.
     *
     * You can then add a auth scope to a field or query like so:
     *
     * ```ts
     * builder.queryField('example', (t) =>
     *   t.withAuth({ authenticated: true }).field({
     *     type: Example,
     *     resolve: async () => {...},
     *   })
     * );
     * ```
     */
    authScopes: async (ctx) => ({
      /**
       * Note that you should mostly use the combined `authenticated` scope
       * in your resolvers, but you can also use the individual scopes if needed
       * eg. when a query should only be available to users with a session but
       * they have not yet selected an active organisation.
       */
      authenticated: hasValidSession(ctx) && hasValidOrganisation(ctx),
      session: hasValidSession(ctx),
      organisation: hasValidOrganisation(ctx),
    }),
  },
});

export type SchemaBuilder = typeof builder;

// Helpers

type NonNullableFields<T, K extends keyof T = keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>;
};

// Mark the fields that are guaranteed to be present in the context
type AuthContext<T extends keyof GraphQlContext> = NonNullableFields<
  GraphQlContext,
  T
>;
