---
name: persistence
description: Change Drizzle persistence code and schema migrations safely and reversibly.
---

# Persistence

Read [database guidance](../../../docs/database/guidance.md) and [migrations](../../../docs/database/migration.md).

- Keep SQL and Drizzle access behind the DAO/database layer.
- Generate migrations from the intended schema change; inspect the generated SQL before applying it locally.
- Preserve data and compatibility through staged migrations when a destructive change is unavoidable.

