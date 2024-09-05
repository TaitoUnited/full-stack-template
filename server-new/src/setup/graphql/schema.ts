import { builder } from './builder';
import * as user from '~/domain/user/user.resolver';
import * as session from '~/domain/session/session.resolver';
import * as organisation from '~/domain/organisation/organisation.resolver';
import * as post from '~/domain/example/post/post.resolver';
import * as chat from '~/domain/example/chat/chat.resolver';

export function setupSchema() {
  /**
   * Define the base query and mutation types.
   * These will be populated by `builder.queryField` and `builder.mutationField`
   * by each app entity separately.
   */
  builder.queryType({});
  builder.mutationType({});

  // Add resolvers for each entity
  organisation.setupResolvers();
  session.setupResolvers();
  user.setupResolvers();
  post.setupResolvers();
  chat.setupResolvers();

  return builder.toSchema();
}
