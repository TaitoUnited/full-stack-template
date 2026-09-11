---
name: client-testing
description: Use for creating, changing, classifying, or running client unit tests. Do not use for behavior requiring a running client/server boundary; use e2e-testing or server-testing instead.
---

# Client testing

Read [client testing](../../../docs/testing/client.md) and [client accessibility](../../../docs/client/accessibility.md).

- Test user-observable behavior through accessible roles, names, and text rather than implementation details.
- Add a unit test only for meaningful client-only behavior such as branching, derived state, or persisted state; skip trivial prop pass-through and framework behavior.
- Do not mock fetch, GraphQL/REST transports, service workers, or internal application hooks, contexts, and business logic. Mock only an unavailable DOM implementation or suppress an unrelated side effect.
- Run the relevant `client/` unit tests and `npm run verify` before handoff.
