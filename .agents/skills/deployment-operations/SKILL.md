---
name: deployment-operations
description: Use only for an explicitly requested deployment review, pipeline change, environment issue, or deployment diagnosis. Do not use for ordinary local development or persistent infrastructure design; use taito-local or infrastructure-change instead.
---

# Deployment operations

Read [deployment overview](../../../docs/deployment/README.md), [environments](../../../docs/deployment/environments.md), and [diagnostics](../../../docs/deployment/diagnostics.md).

- Start with read-only logs, status, and configuration checks; identify the environment and deployed revision.
- Respect the CI/CD pipeline as the normal deployment path.
- Identify the first failed pipeline stage, then inspect its owning inputs: package and lockfiles for artifacts, migration output for database stages, rendered values and readiness for deployment stages, and test output for verification stages.
- For a remote change, provide the exact user-run command with its target, prerequisites, impact, verification, and recovery. Do not deploy, roll back, alter remote configuration, or rotate secrets yourself.
