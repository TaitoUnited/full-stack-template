# Authentication and authorization

Request context establishes verified identity and authentication metadata. Do not construct authenticated contexts in production code or trust client-supplied identity fields.

- Keep sessions opaque, securely stored, and validated by the server. Preserve secure cookie behavior and do not log, return, or persist raw client tokens where a hash is intended.
- Put authorization in services before protected reads and writes. Resolvers and routes establish transport authentication but are not the sole authorization boundary.
- Keep DAOs authorization-agnostic and pass already-authorized inputs to them.
- Client navigation guards are user experience only. The server must enforce access for every protected query, mutation, route, and storage operation.
- Test authenticated, unauthenticated, forbidden, and cross-scope behavior in integration tests when authorization changes.
