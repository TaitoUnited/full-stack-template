---
name: server-testing
description: Use for creating, changing, classifying, or running server unit, integration, REST API, or GraphQL API tests. Do not use for browser unit tests or Playwright end-to-end tests.
---

# Server testing

Read [server testing](../../../docs/testing/server.md) and [testing overview](../../../docs/testing/README.md).

- Select the narrowest test layer that proves the behavior, then add integration/API coverage when a boundary changes.
- Use integration tests by default for service behavior, authorization, persistence, state transitions, and error cases. Keep API tests as representative real-request transport checks and unit tests for complex pure logic or unavoidable external boundaries.
- Do not mock or spy on application configuration, permissions, DAOs, services, or the database. Mock only unavoidable third-party network boundaries and assert observable outcomes.
- Keep test state inside fixtures or helper callbacks, use unique data for unique constraints, and clean external/global resources rather than ordinary disposable-database rows.
- Keep test data isolated and assert authorization and error behavior as well as happy paths.
- Run the relevant `server/` test script and `npm run verify` before handoff.
