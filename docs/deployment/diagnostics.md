# Deployment diagnostics

Start with read-only information: resolved configuration, build logs, deployment status, workload logs, and health endpoints. Narrow the target environment explicitly and redact credentials, cookies, tokens, and full request payloads.

Identify the first failed pipeline stage before proposing a remedy:

- For artifact preparation, inspect the relevant Dockerfile, package manifest, lockfile, and package verification output.
- For database stages, inspect migration output, connection configuration, and proxy/database health.
- For deployment/wait stages, inspect rendered Helm values, workload events, readiness probes, ingress, and certificate state.
- For test/verification stages, distinguish a service-test failure from deployment readiness or endpoint-routing failure.

Use `taito status:ENV`, `taito logs:CONTAINER:ENV`, and the project-specific `taito open` targets as appropriate. Do not use a recovery command that changes remote infrastructure, secrets, workloads, or databases while diagnosing; explain the proposed command and its consequence for the user to run.
