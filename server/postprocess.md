# Post-Implementation Quality Checklist

This document outlines the quality criteria that must be met after a feature implementation is complete. Every feature must be checked against these criteria and refactored until all requirements are satisfied.

## Quality Criteria

### 1. Test Execution

- **Run all tests**: Execute the test suite for the implemented feature
- **All tests must pass**: Ensure that all tests related to the feature pass successfully
- **No test failures**: Fix any failing tests before proceeding to other checks

### 2. Feature Scope Validation

- **Check for redundant functionality**: Review the implementation and verify that all code directly relates to the feature description
- **Remove out-of-scope code**: Any functionality not explicitly described in the feature description should be removed or justified as a necessary dependency
- **Stay within scope**: The implementation should only include what was specified in the feature description

### 3. Overengineering Check

- **Simplify complex solutions**: Review the implementation for unnecessary complexity
- **Remove premature abstractions**: Avoid creating abstractions, patterns, or structures that are not currently needed
- **Prefer simple solutions**: Choose the simplest solution that meets the requirements
- **Avoid future-proofing**: Do not add code "just in case" - only implement what is needed now

### 4. Defensive Programming Review

- **Follow feature description error handling**: Only implement error handling that is explicitly described in the feature description's "Error Handling" section
- **Remove redundant error handling**: Do not add extra error handling, validation, or defensive checks that are not specified in the feature description
- **Trust the specification**: If error handling is not mentioned, assume it should follow standard framework behavior
- **No additional validation**: Do not add validation logic beyond what is specified in the feature description

### 5. Custom Code vs. Dependencies

- **Prefer established dependencies**: If implementing generic functionality (e.g., validation, formatting, parsing), check if there are widely-used and recognized dependencies that can be used instead
- **Avoid reinventing the wheel**: Do not write custom code for problems that have well-established solutions
- **Use recognized libraries**: Only consider dependencies that are:
  - Widely used in the ecosystem
  - Actively maintained
  - Well-documented
  - Have good community support

### 6. Framework and Plugin Patterns

- **Check for Fastify plugins**: Before adding custom functionality, check if Fastify has a plugin that provides it
- **Prefer Fastify plugins**: If Fastify has an official or well-maintained plugin (e.g., `@fastify/multipart`, `@fastify/cookie`), use it instead of custom code
- **Use Fastify plugin patterns**: When creating custom plugins, use `fastify-plugin` to ensure proper encapsulation
- **Follow GraphQL/Pothos patterns**: Use established Pothos patterns for GraphQL schema building instead of custom approaches

### 7. Architecture Patterns Compliance

- **Follow resolver → service → DAO pattern**: Ensure the data flow follows the established architecture (context flows down, data flows up)
- **Use context correctly**: Services receive `AuthenticatedContext`, DAOs receive `DrizzleDb`
- **Error handling patterns**: Use `throwApiError()` in services, `GraphQLError` in resolvers, `ApiRouteError` in REST routes
- **Authorization in services**: Authorization checks belong in services, not resolvers or DAOs
- **Domain organization**: Code should be organized in domain folders, utilities in `/src/utils`

### 8. Logging Compliance

- **Only log warnings and errors**: Do not log normal behavior, successful operations, or routine activities
- **No console.* methods**: Do not use `console.log`, `console.error`, `console.warn`, or any `console.*` methods
- **Use ctx.log**: Always use `ctx.log` for logging errors and warnings
- **Follow logging patterns**: Log only what is specified in the feature description's error handling section

### 9. Configuration and Secrets

- **Use config object**: Access configuration through the `config` object, not `process.env` directly
- **Use getSecrets()**: Access secrets through `getSecrets()`, not environment variables directly
- **Document configuration**: All new configuration values and secrets must be documented in the feature description

### Examples

#### Example 1: Redundant Error Handling

**Incorrect**: Adding try-catch blocks everywhere when not specified
```typescript
async function getPost(ctx: AuthenticatedContext, id: string) {
  try {
    checkOrganisationMembership(ctx);
    const post = await postDao.getPost(ctx.db, { id, organisationId: ctx.organisationId });
    if (!post) {
      throwApiError({
        initiator: ctx.initiator,
        errorType: 'notFound',
        message: 'Post not found',
      });
    }
    return post;
  } catch (error) {
    ctx.log.error('Error in getPost', { error });
    throw error;
  }
}
```

**Correct**: Following the feature description
```typescript
async function getPost(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);
  return postDao.getPost(ctx.db, {
    organisationId: ctx.organisationId,
    id,
  });
}
```

#### Example 2: Custom Code vs. Dependency

**Incorrect**: Writing custom email validation
```typescript
export const validateEmail = (email: string): boolean => {
  // Custom regex implementation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

**Correct**: Using existing validation utilities (if appropriate)
```typescript
import { isValidEmail } from '~/src/utils/validation';
// Use existing validation functions from /src/utils
```

#### Example 3: Fastify Plugin Usage

**Incorrect**: Implementing custom cookie handling
```typescript
// Custom cookie parsing and handling
```

**Correct**: Using Fastify plugin
```typescript
import fastifyCookie from '@fastify/cookie';
await server.register(fastifyCookie);
```

#### Example 4: Overengineering

**Incorrect**: Creating unnecessary abstractions
```typescript
class DatabaseQueryBuilder {
  // Complex abstraction layer over Drizzle
}
```

**Correct**: Simple, direct Drizzle ORM usage
```typescript
return db
  .select()
  .from(postTable)
  .where(eq(postTable.id, id))
  .then((rows) => rows[0]);
```

#### Example 5: Logging Mistakes

**Incorrect**: Logging normal operations and using console.log
```typescript
async function getPost(ctx: AuthenticatedContext, id: string) {
  console.log('Fetching post', id);
  ctx.log.info('Fetching post', { postId: id });
  const post = await postDao.getPost(ctx.db, { id });
  ctx.log.info('Post fetched successfully', { post });
  return post;
}
```

**Correct**: Only log errors using ctx.log
```typescript
async function getPost(ctx: AuthenticatedContext, id: string) {
  try {
    return await postDao.getPost(ctx.db, { id });
  } catch (error) {
    ctx.log.error('Failed to fetch post', { postId: id, error: error.message });
    throw error;
  }
}
```

#### Example 6: Architecture Pattern Violations

**Incorrect**: Passing context to DAO or authorization in resolver
```typescript
// In resolver
resolve: async (_, args, ctx) => {
  if (!hasValidOrganisationRole(ctx, ROLES.ADMIN)) {
    throw GraphQLError.forbidden('Access denied');
  }
  return postDao.getPost(ctx, args.id);
}

// In DAO
async function getPost(db: DrizzleDb, ctx: AuthenticatedContext, id: string) {
  // ...
}
```

**Correct**: Following the architecture patterns
```typescript
// In resolver
resolve: async (_, args, ctx) => {
  return postService.getPost(ctx, args.id);
}

// In service
async function getPost(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);
  if (!hasValidOrganisationRole(ctx, ROLES.ADMIN)) {
    throwApiError({
      initiator: ctx.initiator,
      errorType: 'forbidden',
      message: 'Access denied',
    });
  }
  return postDao.getPost(ctx.db, { organisationId: ctx.organisationId, id });
}

// In DAO
async function getPost(db: DrizzleDb, params: { id: string; organisationId: string }) {
  // ...
}
```

## Post-Implementation Process

1. **Run tests**: Execute the test suite and ensure all tests pass
2. **Review against feature description**: Compare implementation with the feature description
3. **Check for redundancy**: Remove any code not specified in the feature description
4. **Simplify**: Remove overengineering and unnecessary complexity
5. **Remove defensive programming**: Remove error handling not specified in the feature description
6. **Evaluate dependencies**: Check if custom code can be replaced with well-established dependencies
7. **Check Fastify plugins**: Verify if Fastify provides plugins for any custom functionality
8. **Verify architecture patterns**: Ensure the implementation follows resolver → service → DAO pattern
9. **Check logging**: Verify that only errors/warnings are logged using `ctx.log`, no `console.*` methods
10. **Verify configuration**: Ensure configuration and secrets are accessed correctly
11. **Refactor**: Make necessary changes to meet all quality criteria
12. **Re-test**: Run tests again to ensure refactoring didn't break anything
13. **Repeat**: Continue until all criteria are met

## Summary

The goal of this checklist is to ensure that:
- Features are implemented exactly as specified, nothing more, nothing less
- Code is simple and maintainable, avoiding unnecessary complexity
- Error handling follows the feature specification precisely
- Well-established solutions are preferred over custom implementations
- Fastify plugins and established patterns are preferred when available
- Architecture patterns (resolver → service → DAO) are consistently followed
- Logging follows the established patterns (only warnings/errors, using `ctx.log`)
- Configuration and secrets are accessed through the proper patterns

Following these criteria ensures a clean, maintainable codebase that stays true to the feature specifications and architectural principles outlined in `architecture.md`.
