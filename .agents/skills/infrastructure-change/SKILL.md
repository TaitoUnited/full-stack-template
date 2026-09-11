---
name: infrastructure-change
description: Use for Taito, Helm, Terraform, cloud-resource, scheduled-job, or persistent-infrastructure changes. Do not use for routine application deployment diagnosis or ordinary local container work.
---

# Infrastructure changes

Read [deployment infrastructure](../../../docs/deployment/infrastructure.md), [pipeline changes](../../../docs/deployment/pipeline-changes.md), and [CLI infrastructure](../../../docs/cli/infrastructure.md).

- Edit project-level `scripts/*.yaml` and `scripts/taito/*.sh` configuration, not generated wrappers.
- Consider resource lifecycle, secret mapping, environment overrides, and rollback before changing a definition.
- Distinguish application deployment configuration from persistent Terraform-managed resources and use the documented workflow for the affected one.
- For a remote apply, provide the user with the exact target, prerequisites, impact, verification, and recovery. Do not apply Terraform or deploy remote infrastructure yourself.
