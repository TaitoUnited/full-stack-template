---
name: database-recovery
description: Use only for an explicitly requested migration recovery, database recreation, dump import, or data replacement. Do not use for ordinary schemas, migrations, queries, or seeds; use persistence instead.
---

# Database recovery

Read [database operations](../../../docs/database/operations.md) and [database guidance](../../../docs/database/guidance.md).

- Diagnose with read-only checks first and record the affected environment, migration state, and scope.
- Do not drop data, run destructive repair SQL, or change a remote database without explicit user approval and a recovery plan.
- Prefer a tested forward migration or restore procedure over ad-hoc production changes.
- Confirm the exact target, backup prerequisite, impact, and verification before any recreation, import, or replacement. Drizzle has no automatic rollback.
- Keep dumps with sensitive data outside version control and redact their contents from output and logs.
