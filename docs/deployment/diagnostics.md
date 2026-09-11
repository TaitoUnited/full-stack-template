# Deployment diagnostics

Start with read-only information: resolved configuration, build logs, deployment status, workload logs, and health endpoints. Narrow the target environment explicitly and redact credentials, cookies, tokens, and full request payloads.

Use `taito status:ENV`, `taito logs:CONTAINER:ENV`, and the project-specific `taito open` targets as appropriate. Do not use a recovery command that changes remote infrastructure, secrets, workloads, or databases while diagnosing; explain the proposed command and its consequence for the user to run.
