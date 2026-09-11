# Deployment and CI/CD

Taito drives builds, deployments, and infrastructure. Application deployment and persistent infrastructure are separate workflows: deployment commands deliver container/application changes, while `taito env apply:ENV` manages Terraform-backed resources.

## Task routing

| Task | Read |
| --- | --- |
| Select a branch, PR, or shared-resource environment | [environments](environments.md) |
| Understand CI ownership and checks | [CI systems](ci-systems.md) |
| Configure cleanup for closed PR environments | [PR environment cleanup](pr-environment-cleanup.md) |
| Change stage ordering, environment mapping, or CI inputs | [pipeline changes](pipeline-changes.md) |
| Change Helm, Terraform, or a persistent cloud resource | [infrastructure](infrastructure.md) |
| Investigate a failed or incomplete deployment | [diagnostics](diagnostics.md) |

Keep each concern in its owning source: project and environment settings in `scripts/taito/`, application deployment configuration in `scripts/helm.yaml`, persistent resources in `scripts/terraform.yaml`, and the provider CI configuration in its pipeline files. Do not read or edit every deployment file for a narrowly scoped change.

AI agents may inspect and prepare local changes. They must not execute a non-local Taito command that mutates deployments, infrastructure, secrets, or databases. Instead provide the user the exact command, target, prerequisite, impact, verification, and recovery guidance.
