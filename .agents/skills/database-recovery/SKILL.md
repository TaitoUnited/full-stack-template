---
name: database-recovery
description: Investigate and recover database issues with backups, migrations, and data safety as the priority.
---

# Database recovery

Read [database operations](../../../docs/database/operations.md) and [database guidance](../../../docs/database/guidance.md).

- Diagnose with read-only checks first and record the affected environment, migration state, and scope.
- Do not drop data, run destructive repair SQL, or change a remote database without explicit user approval and a recovery plan.
- Prefer a tested forward migration or restore procedure over ad-hoc production changes.

