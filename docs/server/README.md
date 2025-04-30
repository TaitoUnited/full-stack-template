# Server

Looking for the old server instructions? See the old server docs [here](/docs/other/alternatives.md#full-stack-template--server-old).
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
import { Type } from "@sinclair/typebox";

import { type ServerInstance } from "~/setup/server";

export async function postRoutes(server: ServerInstance) {
  server.route({
    method: "GET",
    url: "/posts",
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
import { postRoutes } from "~/domain/post/post.routes";

export async function setupServer(server: ServerInstance) {
  // ...
  await server.register(postRoutes);
  // ...
}
```
