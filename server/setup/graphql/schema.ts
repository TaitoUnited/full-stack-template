import fs from 'node:fs';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { DateTimeISOResolver } from 'graphql-scalars';

import { builder } from './builder';
import { config } from '~/src/utils/config';
import * as session from '~/src/session/session.resolver';
import * as organisation from '~/src/organisation/organisation.resolver';

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

  const schema = builder.toSchema();

  /**
   * Automatically write the schema to a file when running locally.
   * We can use this file to generate TypeScript types for our queries and mutations.
   */
  if (config.COMMON_ENV === 'local' && config.NODE_ENV === 'development') {
    // oxlint-disable-next-line node/no-sync
    fs.writeFileSync(
      new URL('../../shared/schema.gql', import.meta.url),
      printSchema(lexicographicSortSchema(schema))
    );
  }

  return schema;
}
