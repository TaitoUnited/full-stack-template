# Authentication and authorization

Request context establishes verified identity and authentication metadata. Do not construct authenticated contexts in production code or trust client-supplied identity fields.

## Sessions and request identity

Keep client session tokens opaque and store only a one-way hash where persistent storage is needed. Validate expiry server-side, retain secure HTTP-only cookie behavior, and treat a change to token encoding or hashing as a rollout-sensitive migration decision. Every route must select its authentication mode deliberately; setup defaults are diagnostics, not authorization.

## Authorization boundary

- Keep sessions opaque, securely stored, and validated by the server. Preserve secure cookie behavior and do not log, return, or persist raw client tokens where a hash is intended.
- Put authorization in services before protected reads and writes. Resolvers and routes establish transport authentication but are not the sole authorization boundary.
- Keep DAOs authorization-agnostic and pass already-authorized inputs to them.
- Client navigation guards are user experience only. The server must enforce access for every protected query, mutation, route, and storage operation.
- Test authenticated, unauthenticated, forbidden, and cross-scope behavior in integration tests when authorization changes.

Authorization results that can be reused during one request should be scoped to that request only. Never turn a provider failure or unavailable membership source into an empty authorization result; preserve the last verified state or fail safely according to the documented application policy.
