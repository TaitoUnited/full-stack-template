---
name: persistence
description: Use for ordinary PostgreSQL access, Drizzle queries, transactions, schemas, migrations, or seeds. Do not use for deliberate recreation, dump import, or data repair; use database-recovery instead.
---

# Persistence

Read [database guidance](../../../docs/database/guidance.md) and [migrations](../../../docs/database/migration.md).

- Keep SQL and Drizzle access behind the DAO/database layer.
- Always propagate the supplied request-scoped database handle. Do not create another pool, retain a checked-out client, or bypass a request transaction.
- Use a transaction for a multi-write invariant and perform every participating query through that transaction object.
- Keep joins and related queries explicit in DAOs; foreign keys remain the source of relationship integrity.
- Generate migrations from the intended schema change; inspect the generated SQL before applying it locally.
- Preserve data and compatibility through staged migrations when a destructive change is unavoidable.
