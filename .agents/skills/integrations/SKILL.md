---
name: integrations
description: Integrate external services with isolated adapters, secure configuration, and failure-aware behavior.
---

# Integrations

Read [server integrations](../../../docs/server/integrations.md) and [configuration and secrets](../../../docs/configuration/secrets.md).

- Keep provider SDKs and protocol details in integration adapters, not domain services or resolvers.
- Validate external data, set timeouts, and make retries/idempotency explicit where needed.
- Configure credentials as secrets and avoid logging provider payloads that contain sensitive data.

