---
name: authz
description: Change server authentication and authorization with explicit identity, permission, and error handling.
---

# Authentication and authorization

Read [server authentication and authorization](../../../docs/server/authentication-authorization.md).

- Authenticate at the boundary and pass a typed request context into domain code.
- Centralize authorization checks near the protected operation; deny by default and distinguish unauthenticated from forbidden access.
- Do not log credentials, tokens, or sensitive authorization details.

