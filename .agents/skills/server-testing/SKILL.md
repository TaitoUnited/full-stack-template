---
name: server-testing
description: Test server behavior at unit, integration, and API boundaries with isolated setup and clear assertions.
---

# Server testing

Read [server testing](../../../docs/testing/server.md) and [testing overview](../../../docs/testing/README.md).

- Select the narrowest test layer that proves the behavior, then add integration/API coverage when a boundary changes.
- Keep test data isolated and assert authorization and error behavior as well as happy paths.
- Run the relevant `server/` test script and `npm run verify` before handoff.
