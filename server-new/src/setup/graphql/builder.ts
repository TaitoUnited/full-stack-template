import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

import { type GraphQlContext } from './server';

export const builder = new SchemaBuilder<{
  Context: GraphQlContext;
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
  AuthScopes: { authenticated: boolean };
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
     *   t.field({
     *     type: Example,
     *     authScopes: { authenticated: true },
     *     resolve: async () => {...},
     *   })
     * );
     * ```
     */
    authScopes: async (context) => ({
      authenticated: !!context.user && !!context.session,
    }),
  },
});

export type SchemaBuilder = typeof builder;
