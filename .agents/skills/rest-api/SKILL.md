---
name: rest-api
description: Implement or change REST endpoints with explicit request validation, authorization, and stable responses.
---

# REST API

Read [server REST API](../../../docs/server/rest-api.md) and [authentication and authorization](../../../docs/server/authentication-authorization.md).

- Validate all untrusted request input at the boundary and return consistent status codes and error shapes.
- Keep handlers thin; call services for business decisions and DAOs for data access.
- Update API tests for successful, validation, authentication, authorization, and failure paths.

