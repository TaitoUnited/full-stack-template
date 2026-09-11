---
name: server-observability
description: Use for server logging, request IDs, error handling, or error reporting. Do not use for browser analytics or client error reporting; use client-observability instead.
---

# Server observability

Read [server observability](../../../docs/server/observability.md).

- Use structured logs with stable event names and useful non-sensitive context.
- Use the request-scoped logger for request work and an application logger only outside it. Preserve request IDs across transports, responses, and error reports.
- Log/report an unexpected failure once at the top-level boundary; use shared transport-aware errors for expected failures and sanitize internal messages.
- Never log credentials, access tokens, or unnecessary personal data.
