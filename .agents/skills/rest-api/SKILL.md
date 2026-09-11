---
name: rest-api
description: Use for server REST routes, request/response schemas, OpenAPI documentation, or REST transport tests. Do not use for GraphQL schema work or browser request state.
---

# REST API

Read [server REST API](../../../docs/server/rest-api.md) and [authentication and authorization](../../../docs/server/authentication-authorization.md).

- Validate all untrusted request input at the boundary and return consistent status codes and error shapes.
- Keep handlers thin; call services for business decisions and DAOs for data access.
- Give every route an explicit authentication mode and define parameters, bodies, and responses through the established schema mechanism rather than a parallel handwritten contract.
- Keep API documentation centrally configured and omit secrets, tokens, internal failures, and sensitive examples.
- Update API tests for successful, validation, authentication, authorization, and failure paths.
