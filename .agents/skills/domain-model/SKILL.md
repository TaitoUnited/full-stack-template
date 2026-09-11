---
name: domain-model
description: Use for canonical vocabulary, ownership, privacy boundaries, and cross-layer domain concepts. Do not use for a narrow implementation change that introduces no domain term or business-rule decision.
---

# Domain model

Read [domain model](../../../docs/domain-model.md) before introducing or materially changing a cross-layer concept.

- Keep business rules in the domain service layer, not transport handlers or database plumbing.
- Name concepts consistently across the schema, API, persistence, and UI; document any new generic term in the consuming application.
- When a concept has an ownership, privacy, or authorization boundary, make that boundary explicit before introducing its schema or API representation.
- Keep the template generic: application-specific vocabulary and policies belong in the consuming application's domain documentation.
