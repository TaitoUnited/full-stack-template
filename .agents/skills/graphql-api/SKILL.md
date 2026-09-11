---
name: graphql-api
description: Use for server GraphQL schema, resolvers, request loaders, setup, or generated server types. Do not use for browser Apollo operations or cache behavior; use client-graphql instead.
---

# GraphQL API

Read [server GraphQL](../../../docs/server/graphql.md), [server architecture](../../../docs/server/architecture.md), and [client GraphQL](../../../docs/client/graphql.md).

- Treat schema changes as contracts: model inputs, outputs, errors, authorization, and deprecation deliberately.
- Keep resolvers thin and delegate business rules to services and persistence to DAOs.
- Make root-field authentication explicit, keep inputs required and output fields non-null by default, and return updated entities or deleted identifiers from mutations.
- Add a request-scoped loader only for repeated field resolution that would otherwise cause N+1 queries. Bind it to the request transaction, keep keys scope-safe, and batch through set-based DAO queries.
- Keep expected domain errors in shared service-level error handling; sanitize unexpected database errors before they reach clients.
- Regenerate and validate affected server and client GraphQL artifacts.
