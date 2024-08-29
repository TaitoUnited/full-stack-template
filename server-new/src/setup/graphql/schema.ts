import { builder } from './builder';
import * as post from '~/core/example/post/post.resolver';
import * as user from '~/core/user/user.resolver';
import * as session from '~/core/session/session.resolver';
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
  session.setupResolvers();
  user.setupResolvers();
  post.setupResolvers();
  chat.setupResolvers();

  return builder.toSchema();
}
