---
name: client-observability
description: Use for browser analytics, telemetry, error reporting, or event instrumentation. Do not use for server logging, request IDs, or server error handling; use server-observability instead.
---

# Client observability

Read [client analytics](../../../docs/client/analytics.md) and [server observability](../../../docs/server/observability.md).

- Follow the existing reporting configuration and production gate.
- Establish the product question and event owner before adding telemetry; keep payloads minimal and environment gating explicit.
- Add contextual error information that helps diagnose failures, but never include secrets or unnecessary personal data.
- Preserve a useful local error UI when reporting is disabled or unavailable, and avoid duplicate reporting across route and component boundaries.
