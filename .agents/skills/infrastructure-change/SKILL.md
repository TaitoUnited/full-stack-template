---
name: infrastructure-change
description: Change Taito-managed Helm and Terraform configuration while preserving environment safety and reviewability.
---

# Infrastructure changes

Read [deployment infrastructure](../../../docs/deployment/infrastructure.md), [pipeline changes](../../../docs/deployment/pipeline-changes.md), and [CLI infrastructure](../../../docs/cli/infrastructure.md).

- Edit project-level `scripts/*.yaml` and `scripts/taito/*.sh` configuration, not generated wrappers.
- Consider resource lifecycle, secret mapping, environment overrides, and rollback before changing a definition.
- Do not apply Terraform or deploy remote infrastructure without explicit user authorization.

