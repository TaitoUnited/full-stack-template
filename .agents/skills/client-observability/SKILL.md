---
name: client-observability
description: Improve client error reporting and diagnostics while minimizing sensitive data collection.
---

# Client observability

Read [client analytics](../../../docs/client/analytics.md) and [server observability](../../../docs/server/observability.md).

- Follow the existing reporting configuration and production gate.
- Add contextual error information that helps diagnose failures, but never include secrets or unnecessary personal data.
- Preserve a useful local error UI when reporting is disabled or unavailable.

