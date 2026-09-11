# Infrastructure changes

Configure container workloads and ingress in `scripts/helm.yaml`; configure persistent cloud resources in `scripts/terraform.yaml`. Environment-specific overrides belong in the documented companion files, not reusable generated folders such as `scripts/helm/`, `scripts/terraform/`, or `scripts/taito/config/`.

- Review which change is application deployment versus persistent infrastructure before editing.
- Keep local Docker Compose, Helm, Terraform, and secret wiring aligned when introducing a container, environment value, secret, database, bucket, or queue.
- Validate rendered configuration and the affected package locally. For remote resource changes, prepare `taito env apply:ENV` for the user rather than executing it.
