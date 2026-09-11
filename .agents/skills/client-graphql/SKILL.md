---
name: client-graphql
description: Use for browser GraphQL operations, Apollo cache behavior, route preloading, Suspense queries, or client mutations. Do not use for server schema, resolver, or service changes; use graphql-api instead.
---

# Client GraphQL

Read [client GraphQL](../../../docs/client/graphql.md) and [server GraphQL](../../../docs/server/graphql.md).

- Define typed operations with the project's gql.tada helpers and keep data-loading ownership close to the route or component that needs it.
- Keep route-owned initial data in loaders via `context.preloadQuery` and read the query reference with the app's `useReadQuery`; reserve component query hooks for component-owned data.
- Include stable IDs and use fragments for child-owned fields so Apollo can normalize and update entities predictably.
- Return changed entities from mutations so the cache can update directly; refetch only when no precise payload or cache update can represent the result.
- Regenerate GraphQL output after schema or operation changes with `npm run generate:graphql` in `client/`.
- Treat loading, error, empty, and cache-update behavior as part of the change.
