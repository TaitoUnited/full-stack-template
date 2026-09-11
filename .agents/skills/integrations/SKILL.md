---
name: integrations
description: Use for OAuth, provider SDKs, outbound HTTP, webhooks, or third-party service integrations. Do not use for S3-compatible object storage, buckets, or presigned URLs; use storage instead.
---

# Integrations

Read [server integrations](../../../docs/server/integrations.md) and [configuration and secrets](../../../docs/configuration/secrets.md).

- Keep provider SDKs and protocol details in integration adapters, not domain services or resolvers.
- Validate external data, set timeouts, distinguish revoked authorization from provider/network failure, and make retries/idempotency explicit where needed.
- Keep provider stubs local-only and mock only unavoidable provider/network boundaries in tests; retain real services, DAOs, permissions, and database behavior.
- Configure credentials as secrets and avoid logging provider payloads that contain sensitive data.
