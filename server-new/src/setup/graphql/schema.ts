import { builder } from './builder';
import * as post from '~/core/example/post/post.resolver';
import * as user from '~/core/example/user/user.resolver';
import * as chat from '~/core/example/chat/chat.resolver';

export function setupSchema() {
  /**
   * Define the base query and mutation types.
   * These will be populated by `builder.queryField` and `builder.mutationField`
   * by each app entity separately.
   */
  builder.queryType({});
  builder.mutationType({});

  // Add resolvers for each entity
  post.setupResolvers();
  user.setupResolvers();
  chat.setupResolvers();

  return builder.toSchema();
}
