# full-stack-template | server

Looking for the old server instructions? See the old server docs [here](../alternatives/server-old/README.md).
You can also see all the major changes between the old and new server in the related [PR](https://github.com/TaitoUnited/full-stack-template/pull/174) description.

## Structure recommendations

### Main project structure

All business logic for the server is located under the `/src` folder.
Under the `/src` folder we have the following subfolders:

- `/src/setup` all the setup code for the http server and GraphQL/REST API.
  - Setup code is code that is run once when the server starts.
- `/src/test` unit and api integration test setup and utilities.
  - Note that actual tests are co-located with the code they are testing.
- `/src/types` global types and interfaces for 3rd party libraries.
- `/src/utils` for common utility functions.
- `/src/db` for database client setup, migrations, and seed data.
- `/src/domain` for domain-driven architecture, see below.

### Domain-driven architecture

Prefer domain-driven architecture where each part of a domain or a feature are
co-located in the folder structure. You should place these domain-specific
things under `/src/domain/name-of-domain` folder. This way you can
easily find all the related code and tests for a specific domain or feature.

Here is an example how you could structure your code:

```text
src/
  domain/
    user/
      user.resolver.ts
      user.service.ts
      user.db.ts
      user.test.unit.ts
      user.test.api.ts
    product/
      product.resolver.ts
      product.service.ts
      product.db.ts
      product.test.unit.ts
      product.test.api.ts
```

As you can see from the example above, each domain folder contains all the
related code and tests for that domain. We use filename suffixes to indicate
the type of the file. The currently available suffixes are as follows:

- `.resolver.ts` for GraphQL resolvers.
- `.service.ts` for database access.
- `.db.ts` for database table schemas.
- `.test.unit.ts` for unit tests.
- `.test.api.ts` for API integration tests.

You can add more suffixes if you need to. Just make sure that the naming convention
is consistent across the project.

## Server setup

The server implementation is based on [Fastify](https://fastify.dev/) which is a
highly performant web framework for Node.js. Fastify has a large ecosystem of
plugins that can be used to extend the functionality of the server.

Here are some important plugins that are used in the project:

- `@fastify/multipart` for handling file uploads.
- `@fastify/cookie` for handling cookies.
- `@fastify/type-provider-typebox` for REST API request/response schema validation.
- `@as-integrations/fastify` for Apollo Server integration with Fastify.

It is also possible create your own plugins with `fastify-plugin` package.
We use it to create custom plugins for things like auth, context, and csrf.

## GraphQL API

The project uses [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
for GraphQL API and [Pothos](https://pothos-graphql.dev/) for building the GraphQL
schema in a type-safe way.

### Shared schema

During local development when the server is started, the schema is automatically
generated and written to a shared schema file located at `/shared/schema.gql`.
This file is used by both the server and the client to generate TypeScript types
for the GraphQL queries and mutations.

> ℹ️ **Note**: You should commit the generated schema file to the repository.

### Editor integration

To get the best DX when working with GraphQL, you should install the following
VSCode extensions:

- [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
- [GraphQL: Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)

The extension will automatically read the `graphql.config.ts` at the root of
the repository (not root of `/server`!) and provide intellisense for your queries
and mutations.

## REST API

The project uses Fastify for REST API. New API routes can be defined by creating
a `<entity>.routes.ts` file in the entity's domain folder and export a function
that receives the Fastify server instance, for example:

```typescript
import { Type } from '@sinclair/typebox';

import { type ServerInstance } from '~/setup/server';

export async function postRoutes(server: ServerInstance) {
  server.route({
    method: 'GET',
    url: '/posts',
    onRequest: [server.authenticate],
    schema: {
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            title: Type.String(),
            content: Type.String(),
            createdAt: Type.String(),
          })
        ),
      },
    },
    handler: async (request) => {
      // Your route handler code here
    },
  });
}
```

Note how you can use the `@sinclair/typebox` library to define the request and
response schema for the route. This way you can ensure that the request and
response data is correctly validated and type checked.

Finally, you need to register the new routes in the `/src/setup/setup.ts` file:

```typescript
import { postRoutes } from '~/domain/post/post.routes';

export async function setupServer(server: ServerInstance) {
  // ...
  await server.register(postRoutes);
  // ...
}
```

## Database

We use [PostgreSQL](https://www.postgresql.org/) as the database for the server
and [Drizzle](https://orm.drizzle.team/docs/overview) as the database management
tool and ORM / query builder.

The main database setup code is located in the `/src/db` folder. Here you can
find the database client setup, migrations, and seed data.

All the database tables are defined in each domain entity's `*.db.ts` file.
For example a table schema could be defined as follows for a `user` entity:

```typescript
import { pgTable, timestamp, text, boolean, uuid } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});
```

> ⚠️ **Note**:
> The schema files SHOULD NOT contain any runtime logic besides defining your DB schema.
> In particular, your DB connection should be defined separately.
> Otherwise, that logic will be executed whenever you run any drizzle-kit commands.

### Migrations

When you need to make changes to the database schema, you need to first modify
the table schema in the `/src/domain/<domain-name>/<entity>.db.ts` file.
Then you can create a new migration file by running the following command:

```sh
npm run db:migrate:generate
```

This will create a new migration file in the `/src/db/migrations` folder.
With the server running in the background, you can then run the migration
with the following command:

```sh
taito exec:server npm run db:migrate
```

If you realise that the migration is incorrect, you can drop the migration with:

```sh
npm run db:migrate:drop
```

But note that if you already ran the migration, you need to manually revert the
migration changes from the database. Drizzle doesn't currently support migration
[rollbacks](https://github.com/drizzle-team/drizzle-orm/discussions/1339).

One option is to recreate the database by running:

```sh
taito db recreate
```

And then you can run the existing migrations and seed data again to get the database
back to the state before the incorrect migration. See the next section for more
information about seeding data.

You can read more about how to do migrations with Drizzle in their [docs](https://orm.drizzle.team/docs/migrations).

TODO: how do we add support for [`drizzle-kit push`](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push)?

#### Database dumps

If your seeders are not comprehensive enough you might want to take a database
dump before running any migrations. This way you can easily restore the database
to the previous state if something goes wrong.

You can use `taito-cli` to take a database dump:

```sh
# Take a database dump
taito db dump dump.sql -- --data-only

# Import the database dump back to the database
taito db import:dev dump.sql
```

### Seed data

Seeding meaningful data to the database is important for development and testing.

You can implement seeders in the `/src/db/seed` folder where it is recommended to
create a seeder for each domain entity as the seeding logic can end up quite long
and verbose.

Each seeder file should export a `seed` function that is then imported and used
in the main seed file `/src/db/seed/index.ts`.

For example, a seeder for the `user` entity could look like this:

```typescript
import { type DrizzleDb } from '../index';

export async function seed(db: DrizzleDb) {
  const user1 = await createUser(db, {
    email: 'john@doe.com',
    name: 'John Doe',
  });

  const user2 = await createUser(db, {
    email: 'jane@moe.com',
    name: 'Jane Moe',
  });

  return { user1, user2 };
}

function createUser(db: DrizzleDb, user: { email: string; name: string }) {
  // Use Drizzle ORM to create a new user
}
```

## Testing

There are two main types of tests that you should write for the server:

1. Unit tests for testing individual functions and modules.
2. API integration tests for testing the API endpoints.

The [Vitest](https://vitest.dev/) test runner is configured to run the specific
type of tests based on an env variable `MODE=unit|api` which then configures
the target filename suffix: `.test.unit.ts` or `.test.api.ts`.

Both types of tests are co-located with the code they are testing.

### Unit tests

Unit tests are used to test individual functions and modules in isolation.
They do not require a running server or database and should be fast to run so
that we can run unit tests in git pre-push hook without degrading DX.

For example if you have a `user.utils.ts` file in the `src/domain/user` folder,
you should create a `user.test.unit.ts` file in the same folder that contains
the unit tests for all user related testable units like utility functions.

You can run unit tests with the following command:

```sh
npm run test:unit

# Or with watch mode
npm run test:unit:watch

# Or with taito-cli
taito test:unit:server
```

### API integration tests

API integration tests are used to test the API endpoints. **They require a running
server and database** and are slower to run than unit tests.

We run API integration tests in the CI pipeline but you can also run them locally
with the following command:

```sh
taito test:server
```
