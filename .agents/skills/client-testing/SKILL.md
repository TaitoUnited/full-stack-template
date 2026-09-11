---
name: client-testing
description: Test React client behavior with accessible queries, focused mocks, and realistic user outcomes.
---

# Client testing

Read [client testing](../../../docs/testing/client.md) and [client accessibility](../../../docs/client/accessibility.md).

- Test user-observable behavior through accessible roles, names, and text rather than implementation details.
- Mock network and browser boundaries narrowly; keep shared test setup deterministic.
- Run the relevant `client/` unit tests and `npm run verify` before handoff.
