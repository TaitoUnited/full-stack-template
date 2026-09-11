---
name: client-graphql
description: Safely change Apollo and gql.tada client GraphQL operations and generated artifacts.
---

# Client GraphQL

Read [client GraphQL](../../../docs/client/graphql.md) and [server GraphQL](../../../docs/server/graphql.md).

- Define typed operations with the project's gql.tada helpers and keep data-loading ownership close to the route or component that needs it.
- Regenerate GraphQL output after schema or operation changes with `npm run generate:graphql` in `client/`.
- Treat loading, error, empty, and cache-update behavior as part of the change.

