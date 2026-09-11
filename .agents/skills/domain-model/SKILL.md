---
name: domain-model
description: Model generic application concepts and business rules with clear ownership and testable boundaries.
---

# Domain model

Read [server architecture](../../../docs/server/architecture.md) and [code style](../../../docs/code-style.md).

- Keep business rules in the domain service layer, not transport handlers or database plumbing.
- Name concepts consistently across the schema, API, persistence, and UI; document any new generic term in the consuming application.
- Keep domain-specific policy out of this reusable template guidance.

