---
name: configuration-secrets
description: Change Taito configuration and secret wiring without exposing values or editing generated files.
---

# Configuration and secrets

Read [configuration and secrets](../../../docs/configuration/secrets.md) and the [CLI configuration guide](../../../docs/cli/configuration.md).

- Derive settings through `taito-config.sh` and the `scripts/taito/` configuration hierarchy.
- Declare each secret, map it consistently to local, Helm, and Terraform consumers, and keep values out of Git and logs.
- Do not rotate or inspect remote secret values without explicit user authorisation.

