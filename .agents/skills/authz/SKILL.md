---
name: authz
description: Use for server sessions, verified identity, access scopes, roles, or permission checks. Do not use for client-only navigation guards or ordinary data access with no authorization decision.
---

# Authentication and authorization

Read [server authentication and authorization](../../../docs/server/authentication-authorization.md).

- Authenticate at the boundary and pass a typed request context into domain code.
- Centralize authorization checks near the protected operation; deny by default and distinguish unauthenticated from forbidden access.
- Keep session tokens opaque, hashed at rest, and in secure HTTP-only cookies; treat token-format changes as a session-migration decision.
- Authorize in services before protected reads and writes. DAOs receive only already-authorized inputs and never make permission decisions.
- Test authenticated, unauthenticated, forbidden, and cross-scope cases through integration tests; navigation guards are not security controls.
- Do not log credentials, tokens, or sensitive authorization details.
