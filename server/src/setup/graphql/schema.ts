import fs from 'fs';
import path from 'path';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { DateResolver } from 'graphql-scalars';

import { builder } from './builder';
import { config } from '~/utils/config';
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

  // Custom scalar types
  builder.addScalarType('Date', DateResolver);

  // Add resolvers for each entity
  organisation.setupResolvers();
  session.setupResolvers();
  user.setupResolvers();
  post.setupResolvers();
  chat.setupResolvers();

  const schema = builder.toSchema();

  /**
   * Automatically write the schema to a file when running locally.
   * We can use this file to generate TypeScript types for our queries and mutations.
   */
  if (config.COMMON_ENV === 'local') {
    fs.writeFileSync(
      path.join(__dirname, '../../../shared/schema.gql'),
      printSchema(lexicographicSortSchema(schema))
    );
  }

  return schema;
}
