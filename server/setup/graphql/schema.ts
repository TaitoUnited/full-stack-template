import fs from 'fs';
import path from 'path';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { DateTimeISOResolver } from 'graphql-scalars';

import { builder } from './builder';
import { config } from '~/src/utils/config';
import * as user from '~/src/user/user.resolver';
import * as session from '~/src/session/session.resolver';
import * as organisation from '~/src/organisation/organisation.resolver';
import * as post from '~/src/example/post/post.resolver';
import * as chat from '~/src/example/chat/chat.resolver';

export function setupSchema() {
  /**
   * Define the base query and mutation types.
   * These will be populated by `builder.queryField` and `builder.mutationField`
   * by each app entity separately.
   */
  builder.queryType({});
  builder.mutationType({});

  // Custom scalar types
  builder.addScalarType('Date', DateTimeISOResolver);

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
  if (config.COMMON_ENV === 'local' && config.NODE_ENV === 'development') {
    fs.writeFileSync(
      path.join(__dirname, '../../../shared/schema.gql'),
      printSchema(lexicographicSortSchema(schema))
    );
  }

  return schema;
}
