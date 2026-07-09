# Server

Looking for the old server instructions? See the old server docs [here](/docs/other/alternatives.md#autoklinikka-parts--server-old).
You can also see all the major changes between the old and new server in the related [PR](https://github.com/TaitoUnited/autoklinikka-parts/pull/174) description.

## Structure recommendations

### Main project structure

The server app is structured in a way that allows co-locating domain-specific code
together while keeping the generic code in a separate folder.

- `/setup` all the setup code for the http server and GraphQL/REST API.
  - Setup code is code that is run once when the server starts.
- `/test` unit and api integration test setup and utilities.
  - Note that actual tests are co-located with the code they are testing.
- `/types` global types and interfaces for 3rd party libraries.
- `/db` for database client setup, migrations, and seed data.
- `/src` for domain-driven architecture, see below.
- `/src/utils` for common utility functions.

### Domain-driven architecture

Prefer domain-driven architecture where each part of a domain or a feature are
co-located in the folder structure. You should place these domain-specific
things under `/src/name-of-domain` folder. This way you can
easily find all the related code and tests for a specific domain or feature.

Here is an example how you could structure your code:

```text
src/
  user/
    user.resolver.ts
    user.service.ts
    user.dao.ts
    user.db.ts
    user.test.unit.ts
    user.test.api.ts
  product/
    product.resolver.ts
    product.service.ts
    product.dao.ts
    product.db.ts
    product.test.unit.ts
    product.test.api.ts
```

As you can see from the example above, each domain folder contains all the
related code and tests for that domain. We use filename suffixes to indicate
the type of the file. The currently available suffixes are as follows:

- `.resolver.ts` for GraphQL resolvers and basic authentication.
- `.service.ts` for business logic and more fine-grained authentication.
- `.dao.ts` for database access.
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

Finally, you need to register the new routes in the `/setup/setup.ts` file:

```typescript
import { postRoutes } from "~/post/post.routes";

export async function setupServer(server: ServerInstance) {
  // ...
  await server.register(postRoutes);
  // ...
}
```

## Implementation Patterns

This section describes the patterns and conventions used throughout the codebase for implementing features. Follow these patterns to ensure consistency and maintainability.

### Context and Dependency Flow

The context object (`ctx`) is the primary way to pass dependencies through the application. The flow is: **Resolver → Service → DAO**.

#### Context Structure

The context (`AuthenticatedContext`) contains:

- `ctx.db` - Database connection (DrizzleDb). In GraphQL requests, this is a transaction.
- `ctx.user` - Authenticated user object with `id` and optional `session`.
- `ctx.userOrganisations` - Array of organisations the user belongs to with their roles.
- `ctx.organisationId` - Organisation ID from the `x-organisation-id` header (nullable).
- `ctx.initiator` - Origin of the request: `'graphql' | 'rest' | 'test' | 'seed' | 'unknown'`.
- `ctx.auth` - Authentication helper functions.
- `ctx.log` - Logger instance.
- `ctx.requestId` - Unique request identifier.

#### Context Flow Pattern

- **Resolvers** receive context from GraphQL/REST framework and pass it to services.
- **Services** receive `AuthenticatedContext` and pass `ctx.db` to DAOs.
- **DAOs** receive `DrizzleDb` directly (not the full context).

Example service calling a DAO:

```typescript
async function getPost(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);
  
  return postDao.getPost(ctx.db, {
    organisationId: ctx.organisationId,
    id,
  });
}
```

#### Transaction Handling

GraphQL requests automatically wrap all resolvers in a database transaction. This means:
- All database operations in a single GraphQL request share the same transaction.
- The transaction provides isolation for the entire request.
- REST API routes do NOT use transactions by default (each route handler operates independently).

### Authentication and Authorization

#### GraphQL Authentication

Use `.withAuth({ authenticated: true })` on query/mutation fields to require authentication:

```typescript
builder.queryField('post', (t) =>
  t.withAuth({ authenticated: true }).field({
    type: Post,
    nullable: true,
    args: { id: t.arg.string() },
    resolve: async (_, args, ctx) => {
      // ctx.user is guaranteed to be non-null here
      return postService.getPost(ctx, args.id);
    },
  })
);
```

#### REST Authentication

Use the `server.authenticate` hook in route handlers:

```typescript
server.route({
  method: 'GET',
  url: '/posts',
  onRequest: [server.authenticate],
  handler: async (request) => {
    // request.ctx.user is guaranteed to be non-null here
  },
});
```

#### Authorization in Services

Authorization (checking permissions) happens in services, not resolvers:

- Use `checkOrganisationMembership(ctx)` to verify the user belongs to the organisation from the `x-organisation-id` header.
- Use `hasValidOrganisationRole(ctx, ROLES.ADMIN, ROLES.MANAGER)` to check if the user has specific roles.
- Throw errors using `throwApiError()` when authorization fails.

Example:

```typescript
async function createPost(ctx: AuthenticatedContext, values: {...}) {
  checkOrganisationMembership(ctx);
  
  if (!hasValidOrganisationRole(ctx, ROLES.ADMIN, ROLES.MANAGER)) {
    throwApiError({
      initiator: ctx.initiator,
      errorType: 'forbidden',
      message: 'Creating posts only allowed for admin and manager roles',
    });
  }
  
  return postDao.createPost(ctx.db, {...});
}
```

### Error Handling

#### Error Types

Use `throwApiError()` in services to throw errors that work for both GraphQL and REST:

```typescript
import { throwApiError } from '~/src/utils/error';

throwApiError({
  initiator: ctx.initiator, // Automatically handles GraphQL vs REST
  errorType: 'forbidden',
  message: 'Access denied',
});
```

Available error types: `badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `internal`.

#### Direct Error Throwing

In resolvers, you can throw GraphQL errors directly:

```typescript
import { GraphQLError } from '~/src/utils/error';

throw GraphQLError.unauthorized('Invalid credentials');
```

In REST routes, you can throw REST errors directly:

```typescript
import { ApiRouteError } from '~/src/utils/error';

throw ApiRouteError.notFound('Resource not found');
```

#### DAO Error Patterns

DAOs can throw domain-specific errors that are mapped in resolvers:

```typescript
// In DAO
export class LoginError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// In resolver/service, map to API error
if (error instanceof sessionDao.LoginError) {
  throw GraphQLError.unauthorized(error.message);
}
```

### Database Access Patterns

#### DAO Functions

DAO functions:
- Receive `DrizzleDb` as the first parameter (not context).
- Receive query parameters as an object.
- Return database results directly.
- Use Drizzle ORM query builders.

Example:

```typescript
async function getPost(
  db: DrizzleDb,
  params: { id: string; organisationId?: string | null }
) {
  const organisationCondition = params.organisationId
    ? eq(postTable.organisationId, params.organisationId)
    : undefined;

  return db
    .select()
    .from(postTable)
    .where(and(eq(postTable.id, params.id), organisationCondition))
    .then((rows) => rows[0]);
}
```

#### Service Functions

Service functions:
- Receive `AuthenticatedContext` as the first parameter.
- Perform authorization checks.
- Pass `ctx.db` to DAO functions.
- Handle business logic.

Example:

```typescript
async function getPost(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);
  
  return postDao.getPost(ctx.db, {
    organisationId: ctx.organisationId,
    id,
  });
}
```

#### Database Schema Files

Schema files (`.db.ts`):
- Define tables using Drizzle ORM's `pgTable`.
- Include common fields: `id`, `createdAt`, `updatedAt`.
- Define foreign key relationships using `.references()`.
- Export the table definition.

Example:

```typescript
import { pgTable, timestamp, text, uuid } from 'drizzle-orm/pg-core';

export const postTable = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  title: text('title').notNull(),
  authorId: uuid('author_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
});
```

### GraphQL Resolver Patterns

#### Resolver Registration

Each domain exports a `setupResolvers()` function that registers its GraphQL resolvers:

```typescript
export function setupResolvers() {
  builder.queryField('post', (t) => /* ... */);
  builder.mutationField('createPost', (t) => /* ... */);
}
```

Register resolvers in `/setup/graphql/schema.ts`:

```typescript
import * as organisation from '~/src/organisation/organisation.resolver';

export function setupSchema() {
  // ...
  organisation.setupResolvers();
  // ...
}
```

#### Type Definition

Define GraphQL types using `builder.simpleObject()`:

```typescript
const Post = builder.simpleObject('Post', {
  fields: (t) => ({
    id: t.string(),
    title: t.string(),
    content: t.string(),
    authorId: t.string(),
    createdAt: t.field({ type: 'Date' }),
  }),
});
```

#### Query Fields

Define queries with authentication:

```typescript
builder.queryField('post', (t) =>
  t.withAuth({ authenticated: true }).field({
    type: Post,
    nullable: true, // Explicitly set nullability
    args: { id: t.arg.string() },
    resolve: async (_, args, ctx) => {
      return postService.getPost(ctx, args.id);
    },
  })
);
```

**Note**: Fields are NOT nullable by default. Use `nullable: true` when needed.

#### Mutation Fields

Define mutations similarly:

```typescript
builder.mutationField('createPost', (t) =>
  t.withAuth({ authenticated: true }).field({
    type: Post,
    args: { 
      title: t.arg.string(), // Required by default
      content: t.arg.string({ required: false }), // Explicitly optional
    },
    resolve: async (_, args, ctx) => {
      return postService.createPost(ctx, {
        ...args,
        authorId: ctx.user.id,
      });
    },
  })
);
```

**Note**: Input arguments are required by default. Use `required: false` for optional arguments.

#### Field Resolvers

Use `builder.objectField()` for nested fields that require additional data:

```typescript
builder.objectField(Post, 'author', (t) =>
  t.withAuth({ authenticated: true }).field({
    type: User,
    nullable: true,
    resolve: async (parent, _, ctx) => {
      return userService.getOrgUser(ctx, parent.authorId);
    },
  })
);
```

### Service Layer Patterns

#### Service Function Structure

Services:
- Receive `AuthenticatedContext` as the first parameter.
- Perform authorization checks first (e.g., `checkOrganisationMembership`).
- Call DAOs with `ctx.db` and parameters.
- Export as a const object with named functions.

Example:

```typescript
async function getPosts(ctx: AuthenticatedContext, search?: string | null) {
  checkOrganisationMembership(ctx);
  
  return postDao.getPosts(ctx.db, {
    organisationId: ctx.organisationId,
    search,
  });
}

export const postService = {
  getPosts,
  getPost,
  createPost,
};
```

#### Service Responsibilities

Services handle:
- **Business logic** - Validation, transformations, workflows.
- **Authorization** - Checking permissions and organisation membership.
- **Orchestration** - Coordinating multiple DAO calls.
- **Error handling** - Converting domain errors to API errors.

DAOs handle:
- **Database access** - Queries, inserts, updates, deletes.
- **Query construction** - Building Drizzle ORM queries.

### Testing Patterns

See [`testing.md`](./testing.md) for testing patterns, conventions, and instructions for running tests.

### Cross-Domain Patterns

#### Importing from Other Domains

When one domain needs data from another:
- Import services (not DAOs) from other domains.
- Services handle authorization, DAOs do not.
- Example: Post resolver uses `userService` to get author information.

```typescript
import { userService } from '../../user/user.service';
import { User } from '../../user/user.resolver';

builder.objectField(Post, 'author', (t) =>
  t.field({
    type: User,
    resolve: async (parent, _, ctx) => {
      return userService.getOrgUser(ctx, parent.authorId);
    },
  })
);
```

#### Shared Utilities

Common utilities go in `/src/utils`:
- Error handling (`error.ts`)
- Authentication (`authentication.ts`)
- Authorization (`authorisation.ts`)
- Validation (`validation.ts`)
- Configuration (`config.ts`)
- Logging (`log.ts`)

Domain-specific utilities stay in the domain folder.

### Registration Patterns

#### Resolver Registration

Resolvers are registered in `/setup/graphql/schema.ts`:

```typescript
import * as organisation from '~/src/organisation/organisation.resolver';

export function setupSchema() {
  builder.queryType({});
  builder.mutationType({});
  
  // Register resolvers
  organisation.setupResolvers();
  // ...
}
```

#### Route Registration

REST routes are registered in `/setup/setup.ts`:

```typescript
import { organisationRoutes } from '~/src/organisation/organisation.routes';

export async function setupServer(server: ServerInstance) {
  // ...
  await server.register(organisationRoutes);
  // ...
}
```

## Feature Description Template

Before implementing a new feature, you must create a feature description that documents the requirements, design, and implementation details. This serves as the single source of truth for feature development and must be created before implementation begins.

### Required Sections

A feature description **must** contain the following sections:

#### 1. Business Rationale

- **Clear value proposition**: Why does this feature exist?
- **Business purpose**: What problem does it solve?
- **User benefit**: How does it provide value to users or the business?

This section must clearly articulate the business justification for the feature's existence. Without a clear business rationale, the feature should not be implemented.

#### 2. Database Requirements

- **Database tables**: What tables are needed? Describe their structure.
- **Schema files**: What `.db.ts` files need to be created or modified?
- **Migrations**: What migrations are required? Provide migration details.
- **Relationships**: Are there foreign keys or relationships to other tables?
- **Indexes**: Are any indexes needed for performance?

#### 3. GraphQL/REST API Requirements

- **GraphQL queries/mutations**: What GraphQL operations are needed? Describe their inputs and outputs.
- **REST routes**: What REST endpoints are needed? Describe their methods, paths, and request/response schemas.
- **Type definitions**: What GraphQL types need to be defined?
- **Authentication**: Which operations require authentication?
- **Authorization**: What authorization checks are needed?

#### 4. Authorization Requirements

- **Who can access**: Which users or roles can access this feature?
- **Organisation membership**: Does this require organisation membership checks?
- **Role-based access**: What roles are required for different operations?
- **Permission checks**: What specific permissions or validations are needed?

#### 5. Configuration and Secrets

- **New environment variables**: What new configuration values are needed?
- **Secrets**: Are any new secrets required? How will they be managed?
- **Default values**: What are the default values for configuration?
- **Validation**: What validation is needed for configuration values?

#### 6. Business Logic Description

- **Clear, unambiguous description**: Detailed description of what the business logic does
- **Input/Output**: What are the inputs and expected outputs?
- **Edge cases**: What edge cases need to be handled?
- **Validation rules**: What validation rules apply?
- **State transitions**: If applicable, describe any state machines or transitions

This section must be **unambiguous and detailed** enough that a developer can implement it without additional clarification.

#### 7. Error Handling

- **Explicit error handling description**: Detailed description of how errors are handled throughout the feature
- **Error types**: What types of errors can occur? (validation errors, authorization errors, business logic errors, etc.)
- **Error responses**: How should each error type be handled and what response should be returned?
- **Error propagation**: How should errors propagate through the layers (DAO → Service → Resolver)?
- **HTTP status codes**: What HTTP status codes should be returned for different error scenarios?
- **GraphQL error codes**: What GraphQL error codes should be returned?
- **Error messages**: What error messages should be returned to the client?
- **Logging**: What errors should be logged and at what level?

This section must explicitly describe all error handling scenarios. Error handling is a critical aspect of feature design and must be clearly documented.

### Validation Criteria

Before a feature description is accepted for implementation, it **must** pass the following criteria:

1. ✅ **Business Rationale**: Clear business value and purpose documented
2. ✅ **Database Requirements**: All tables, schema files, migrations, and relationships documented
3. ✅ **GraphQL/REST API Requirements**: All API operations, types, authentication, and authorization documented
4. ✅ **Authorization Requirements**: All authorization checks and role requirements documented
5. ✅ **Configuration**: All configuration and secrets identified
6. ✅ **Business Logic**: Clear, unambiguous, detailed description provided
7. ✅ **Error Handling**: Explicit error handling description provided for all error scenarios

### Feature Description Rejection

**If a feature description does not meet all validation criteria, it will NOT be generated/implemented.** Instead, the user will receive a detailed description of the feature's shortcomings, including:

- Which required sections are missing
- Which sections lack sufficient detail
- What specific information needs to be added or clarified
- Any ambiguities that need to be resolved

The feature description must be updated to address all shortcomings before implementation can proceed.

### Example Feature Description Structure

```markdown
# Feature Name

## Business Rationale

[Clear description of value, purpose, and business justification]

## Database Requirements

[Tables, schema files, migrations, and relationships needed]

## GraphQL/REST API Requirements

[API operations, types, authentication, and authorization needed]

## Authorization Requirements

[Who can access, role requirements, permission checks]

## Configuration and Secrets

[Environment variables and secrets required]

## Business Logic Description

[Detailed, unambiguous description of business logic]

## Error Handling

[Explicit description of all error handling scenarios]
```

## Decision-Making Guidelines

When implementing features, follow these guidelines to make consistent architectural decisions:

### When to Create a New Domain Folder

Create a new domain folder (`/src/name-of-domain/`) when:

- The feature represents a **distinct business domain** or **bounded context**
- The feature has its own **data model** (tables/schema)
- The feature requires its own **resolvers/services/DAOs** that are independent
- The feature represents a **major functional area** of the application

**Examples**: `user`, `organisation`, `post`, `product`, `order`

Do **not** create a new domain folder when:

- The feature is a **small extension** to an existing domain
- The feature only **adds fields or operations** to existing functionality
- The feature is a **utility or helper** function (use `/src/utils` instead)

### When to Add Code to `/src/utils` vs Domain Folders

Add to `/src/utils` when:

- The code is **shared across multiple domains**
- The code is **generic utility functions** (error handling, validation, logging, authentication, authorization)
- The code is **not domain-specific**

Add to domain folders when:

- The code is **specific to that domain**
- The code is **business logic** for that domain
- The code is **not reused** by other domains

**Examples of `/src/utils`**: `error.ts`, `authentication.ts`, `authorisation.ts`, `validation.ts`, `config.ts`, `log.ts`

**Examples of domain-specific**: `user.service.ts`, `post.dao.ts`, `organisation.resolver.ts`

### When to Create New Files vs Extend Existing

Create new files when:

- Adding a **new entity** (new `.db.ts`, `.dao.ts`, `.service.ts`, `.resolver.ts`)
- Adding **REST routes** for a domain (new `.routes.ts`)
- Adding **tests** (new `.test.unit.ts`, `.test.integration.ts`, `.test.graphql.api.ts`)

Extend existing files when:

- Adding **new fields or operations** to existing entities
- Adding **new resolvers** to an existing domain's resolver file
- Adding **new service methods** to an existing service
- Adding **new DAO functions** to an existing DAO

### GraphQL vs REST API

Use **GraphQL** when:

- The feature is a **primary API** for the application
- The feature requires **flexible querying** (client selects fields)
- The feature benefits from **schema generation** and type safety
- The feature involves **relationships** and nested data

Use **REST** when:

- The feature is a **simple CRUD operation**
- The feature is a **webhook endpoint** or **external integration**
- The feature requires **file uploads** or **specific HTTP semantics**
- The feature is a **legacy integration** that requires REST

In general, **prefer GraphQL** for new features, but use REST when it better fits the use case.

### Cross-Domain Dependencies

When one domain needs data from another:

- **Always import services** (not DAOs) from other domains
- Services handle authorization and business logic, DAOs do not
- This ensures proper authorization checks and maintains domain boundaries

**Correct**:
```typescript
import { userService } from '../../user/user.service';
```

**Incorrect**:
```typescript
import { userDao } from '../../user/user.dao'; // Don't do this
```

## Migration and Database Change Patterns

When making changes to the database schema, follow these patterns to ensure consistency and maintainability.

### Migration Workflow

1. **Modify schema files**: Update the appropriate `.db.ts` file(s) in the domain folder(s)
2. **Generate migration**: Run `npm run db:migrate:generate` to create a migration file
3. **Review migration**: Check the generated SQL in `/db/migrations/` folder
4. **Test migration**: Run `npm run db:migrate` to test the migration locally
5. **Commit changes**: Commit both the schema changes and migration file

### Creating Migrations

To create a new migration:

```bash
# 1. Modify the schema file (e.g., src/user/user.db.ts)
# 2. Generate the migration
npm run db:migrate:generate

# 3. Review the generated migration file in db/migrations/
# 4. Run the migration
npm run db:migrate
```

The migration generation command (`drizzle-kit generate`) will:
- Scan all `.db.ts` files in `/src`
- Compare the current schema to the database state
- Generate SQL migration files in `/db/migrations/`
- Update migration metadata

### Migration File Naming

Migrations are automatically named by Drizzle Kit with the format:
- `TIMESTAMP_description.sql` (e.g., `0000_young_network.sql`)

The timestamp and description are generated automatically based on the changes detected.

### Migration Commands

Available migration commands:

```bash
# Generate a new migration from schema changes
npm run db:migrate:generate

# Run pending migrations
npm run db:migrate

# Drop all migrations (use with caution - only before running migrations)
npm run db:migrate:drop
```

### Handling Migration Errors

If a migration fails or needs to be corrected:

**Before running the migration:**
- Use `npm run db:migrate:drop` to remove the incorrect migration
- Fix the schema file
- Regenerate the migration

**After running the migration:**
- Drizzle ORM does not currently support automatic rollbacks
- Options:
  1. **Recreate the database** (development only): Use `taito db recreate` and re-run all migrations
  2. **Manual rollback**: Manually revert the database changes using SQL
  3. **Database dump**: Take a database dump before migrations if needed

### Schema File Patterns

When modifying schema files:

- **Add fields**: Add new columns to the table definition
- **Modify fields**: Update column definitions (type, constraints, defaults)
- **Add relationships**: Use `.references()` to add foreign keys
- **Add indexes**: Use Drizzle index definitions (if needed)
- **Follow conventions**: Use `createdAt`, `updatedAt` patterns consistently

Example of adding a field:

```typescript
// Before
export const postTable = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  // ...
});

// After
export const postTable = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  publishedAt: timestamp('published_at'), // New field
  // ...
});
```

### Common Patterns

- **Timestamps**: Use `createdAt` and `updatedAt` with `defaultNow()` and `$onUpdate(() => new Date())`
- **UUIDs**: Use `uuid()` with `primaryKey().defaultRandom()` for IDs
- **Foreign keys**: Use `.references()` with appropriate `onDelete` behavior
- **Nullable fields**: Explicitly set nullable vs notNull based on requirements
- **Defaults**: Use `.default()` or `.defaultNow()` for default values

### Migration Best Practices

1. **One feature per migration**: Each feature should have its own migration(s)
2. **Review generated SQL**: Always review the generated migration SQL before committing
3. **Test migrations**: Test migrations on local/development database first
4. **Backup production**: Always backup production database before running migrations
5. **Keep migrations small**: Prefer multiple small migrations over one large migration
6. **Document breaking changes**: If a migration contains breaking changes, document them clearly

## Configuration and Secrets Management Patterns

Configuration and secrets are handled through the `/src/utils/config.ts` file. Follow these patterns when adding or accessing configuration and secrets.

### Configuration Access

Use the `config` object exported from `~/src/utils/config` to access configuration values:

```typescript
import { config } from '~/src/utils/config';

// Access configuration values
const apiPort = config.API_PORT;
const databaseHost = config.DATABASE_HOST;
```

The `config` object contains:
- **Environment variables** - Direct mappings from environment variables
- **Parsed values** - Values that are parsed (numbers, booleans, etc.)
- **Default values** - Fallback values when environment variables are not set
- **Computed values** - Values derived from environment variables

### Adding New Configuration Values

To add a new configuration value:

1. **Add to `config` object** in `/src/utils/config.ts`:
   ```typescript
   export const config = {
     // ... existing config
     NEW_CONFIG_VALUE: process.env.NEW_CONFIG_VALUE || 'default-value',
     NEW_CONFIG_NUMBER: process.env.NEW_CONFIG_NUMBER 
       ? parseInt(process.env.NEW_CONFIG_NUMBER, 10) 
       : 100,
     NEW_CONFIG_BOOLEAN: process.env.NEW_CONFIG_BOOLEAN === 'true',
   };
   ```

2. **Document the environment variable** in the feature description
3. **Use the config value** in your code (do not access `process.env` directly)

### Secrets Access

Secrets are accessed through the `getSecrets()` function:

```typescript
import { getSecrets } from '~/src/utils/config';

const secrets = await getSecrets();
const databasePassword = secrets.DATABASE_PASSWORD;
const sessionSecret = secrets.SESSION_SECRET;
```

**Important**: Secrets are loaded asynchronously. Always await `getSecrets()` before using secrets.

### Adding New Secrets

To add a new secret:

1. **Add secret reading** in the `getSecrets()` function in `/src/utils/config.ts`:
   ```typescript
   export async function getSecrets() {
     // ... existing secrets
     const s = {
       // ... existing secrets
       NEW_SECRET: await readSecret('NEW_SECRET'),
       NEW_MANDATORY_SECRET: await readMandatorySecret('NEW_MANDATORY_SECRET'),
     };
     // ...
   }
   ```

2. **Choose the right function**:
   - `readSecret()` - Optional secret (returns `null` if not found)
   - `readMandatorySecret()` - Required secret (throws error if not found)

3. **Document the secret** in the feature description
4. **Access via `getSecrets()`** in your code

### Secret Resolution Order

Secrets are resolved in the following order:

1. Environment variable with the secret name (e.g., `SESSION_SECRET`)
2. AWS Secrets Manager (if `SECRET_NAME_SECRETID` environment variable is set)
3. File system path `/run/secrets/SECRET_NAME`
4. Alternative file path (if provided)

### Configuration Patterns

- **Always use `config` object**: Do not access `process.env` directly in application code
- **Use defaults**: Provide sensible defaults for optional configuration
- **Parse values**: Parse strings to numbers, booleans, etc. in the config object
- **Document defaults**: Document default values in code comments
- **Type safety**: The `config` object provides type safety for configuration values

### Secrets Patterns

- **Always use `getSecrets()`**: Do not access secrets directly from environment variables
- **Await secrets**: Always await `getSecrets()` before using secrets
- **Use mandatory secrets**: Use `readMandatorySecret()` for secrets that are required for the application to run
- **Document secrets**: Document all secrets in feature descriptions
- **Never log secrets**: Never log secret values or include them in error messages

### Configuration vs Secrets

- **Configuration**: Non-sensitive values (URLs, ports, feature flags, etc.) - use `config` object
- **Secrets**: Sensitive values (passwords, API keys, certificates, etc.) - use `getSecrets()`

## Logging Patterns

The application does not log normal behavior. Logging is only for warnings and errors. Do not log successful operations, database calls, API calls, or normal business logic execution.

Logging is handled through Bunyan logger instances. Follow these patterns for consistent logging throughout the application.

### Logger Access

Do not use `console.log`, `console.error`, `console.warn`, or any other `console.*` methods. Use `ctx.log` instead.

Use `ctx.log` in resolvers, services, and route handlers only for warnings and errors:

```typescript
async function getPost(ctx: AuthenticatedContext, id: string) {
  try {
    return await postService.getPost(ctx, id);
  } catch (error) {
    ctx.log.error('Failed to fetch post', { postId: id, error: error.message });
    throw error;
  }
}
```

Use `ctx.log` instead of `console.*` because:
- `ctx.log` includes request context (requestId, user, etc.)
- `ctx.log` formats logs for Stackdriver/cloud logging
- `ctx.log` supports structured logging with metadata
- `console.*` methods bypass the logging infrastructure and are not properly formatted

### Log Levels

The application only uses `warn` and `error` log levels. Do not use `trace`, `debug`, `info`, or `fatal`.

- **`warn`** - Warning messages (something unexpected but not an error)
  - Unexpected conditions that don't break functionality
  - Deprecated API usage
  - Missing optional data that affects behavior
  
- **`error`** - Error messages (something went wrong)
  - Exceptions and failures
  - Failed operations
  - Critical issues

Example:

```typescript
try {
  const result = await someOperation();
  // Do not log success - this is normal behavior
} catch (error) {
  ctx.log.error('Operation failed', {
    error: error.message,
    stack: error.stack,
    userId: ctx.user?.id,
  });
  throw error;
}

if (unexpectedCondition) {
  ctx.log.warn('Unexpected condition encountered', { details });
}
```

### What to Log

The application does not log normal behavior. Do not log:
- Successful operations (database queries, API calls, business logic execution)
- Normal requests (HTTP requests, GraphQL queries, normal user actions)
- Database operations (successful queries, inserts, updates, deletes)
- Service calls (successful service method calls, normal data processing)
- Business events (normal user actions, state changes, routine operations)
- Request/response information (normal API calls, status codes, request details)
- Authentication success (successful logins, normal authorization checks)
- Performance metrics (normal operation timing, routine database queries)
- Integration calls (successful external API calls, normal data fetching)

Log only these events:
- **Errors**: All exceptions, failures, and error conditions
- **Warnings**: Unexpected conditions, deprecated usage, missing optional data

### Error Logging

**Always log errors** with full context:

```typescript
try {
  await someOperation();
} catch (error) {
  ctx.log.error('Operation failed', {
    error: error.message,
    stack: error.stack,
    userId: ctx.user?.id,
    operationId: operationId,
    // Include relevant context for debugging
  });
  throw error;
}
```

### Warning Logging

Log warnings for unexpected conditions that don't break functionality:

```typescript
if (data.optionalField === null && weExpectedIt) {
  ctx.log.warn('Optional field missing', {
    userId: ctx.user?.id,
    fieldName: 'optionalField',
  });
  // Continue with fallback behavior
}
```

### Structured Logging

When logging errors or warnings, always use structured logging with metadata objects:

```typescript
// Good - structured logging
ctx.log.error('Database operation failed', {
  error: error.message,
  stack: error.stack,
  userId: ctx.user?.id,
  operation: 'createPost',
  organisationId: ctx.organisationId,
});

// Bad - string interpolation
ctx.log.error(`Database operation failed: ${error.message}`);
```

Structured logging provides:
- Better searchability in log aggregators
- Consistent log format
- Ability to filter and analyze logs

### Request Context

The logger automatically includes request context when using `ctx.log`:
- `requestId` - Unique request identifier
- Request/response information (when available)
- User information (when authenticated)

You don't need to manually add request context to log messages when using `ctx.log`.

### Logging Best Practices

1. Only log warnings and errors - do not log normal behavior, successful operations, or routine activities
2. Do not use `info`, `debug`, or `trace` log levels
3. Always include relevant context in error/warning log messages
4. Use structured logging - use objects for metadata, not string interpolation
5. Always log errors with full context before throwing
6. Never log secrets or sensitive information (passwords, tokens, certificates)
7. Use consistent log message formats across the codebase

### Common Mistakes

**Incorrect:**
```typescript
// Do not use console.log
console.log('Fetching user', userId);

// Do not log normal operations
ctx.log.info('Fetching user', { userId });
ctx.log.info('User fetched successfully', { user });
ctx.log.debug('Database query executed', { query });
```

**Correct:**
```typescript
// Only log errors using ctx.log
try {
  const user = await userService.getUser(ctx, userId);
  return user;
} catch (error) {
  ctx.log.error('Failed to fetch user', { userId, error: error.message });
  throw error;
}
```

Do not use `console.*` methods - always use `ctx.log`. If everything is working normally, there should be no logs. Logs are only for errors and warnings.

### Common Patterns Summary

1. **Resolver → Service → DAO**: Context flows down, data flows up.
2. **Authentication in resolvers**: Use `.withAuth()` or `server.authenticate`.
3. **Authorization in services**: Use `checkOrganisationMembership()` and `hasValidOrganisationRole()`.
4. **Errors in services**: Use `throwApiError()` with `ctx.initiator`.
5. **DAOs receive `db`**: Services receive `ctx`, DAOs receive `ctx.db`.
6. **Services export objects**: Export services as const objects with named functions.
7. **Tests co-located**: Keep tests next to the code they test.
8. **Cross-domain via services**: Import services from other domains, not DAOs.
