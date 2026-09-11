---
name: e2e-testing
description: Add reliable Playwright end-to-end coverage for important cross-service user flows.
---

# End-to-end testing

Read [end-to-end testing](../../../docs/testing/e2e.md) and [testing verification](../../../docs/testing/verification.md).

- Test a user journey and its visible outcome, using resilient locators and explicit test data setup.
- Keep tests independent and clean up data through supported local fixtures or APIs.
- Run Playwright through the documented local workflow; do not point tests at a remote environment without explicit approval.
- Preserve accessible names and semantics even when test IDs are present.
- Never commit or upload `.env.local`, `.auth/user.json`, bootstrap secrets, refresh tokens, or session cookies.
