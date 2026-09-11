---
name: e2e-testing
description: Use for creating, changing, or running Playwright end-to-end tests against cross-service user flows. Do not use for client unit tests, server tests, or credential provisioning.
---

# End-to-end testing

Read [end-to-end testing](../../../docs/testing/e2e.md) and [testing verification](../../../docs/testing/verification.md).

- Test a user journey and its visible outcome, using resilient locators and explicit test data setup.
- Use purpose-specific `data-testid` selectors for E2E interaction and role/name assertions where accessibility itself is under test; do not couple flows to translated copy.
- Keep tests independent and clean up data through supported local fixtures or APIs.
- Run Playwright through the documented local workflow; do not point tests at a remote environment without explicit approval.
- Preserve accessible names and semantics even when test IDs are present.
- Never commit or upload `.env.local`, `.auth/user.json`, bootstrap secrets, refresh tokens, or session cookies.
