# Deployment and CI/CD

Taito drives builds, deployments, and infrastructure. Application deployment and persistent infrastructure are separate workflows: deployment commands deliver container/application changes, while `taito env apply:ENV` manages Terraform-backed resources.

## Routing

- Use [environments](environments.md) for branch-to-environment behavior and PR environments.
- Use [CI systems](ci-systems.md) and [pipeline changes](pipeline-changes.md) when changing CI configuration.
- Use [infrastructure](infrastructure.md) for Helm, Terraform, and cloud-resource changes.
- Use [diagnostics](diagnostics.md) for safe investigation of failed or unhealthy deployments.

AI agents may inspect and prepare local changes. They must not execute a non-local Taito command that mutates deployments, infrastructure, secrets, or databases. Instead provide the user the exact command, target, prerequisite, impact, verification, and recovery guidance.
