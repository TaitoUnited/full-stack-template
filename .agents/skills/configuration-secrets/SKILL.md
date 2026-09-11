---
name: configuration-secrets
description: Use for application configuration, secrets, secret loading, or environment-dependent behavior. Do not use for applying remote infrastructure or deployment mutations; use infrastructure-change or deployment-operations instead.
---

# Configuration and secrets

Read [configuration and secrets](../../../docs/configuration/secrets.md) and the [CLI configuration guide](../../../docs/cli/configuration.md).

- Derive settings through `taito-config.sh` and the `scripts/taito/` configuration hierarchy.
- Put non-secret values behind the central application configuration boundary with explicit parsing and defaults; do not read the process environment throughout domain code.
- Declare each secret, map it consistently to local, Helm, and Terraform consumers, and keep values out of Git and logs.
- Load secrets through the existing cached mechanism and make absence mandatory only when startup cannot work without the value. Do not create provider clients or repeatedly reload secrets in domain modules.
- Do not rotate or inspect remote secret values without explicit user authorisation.
