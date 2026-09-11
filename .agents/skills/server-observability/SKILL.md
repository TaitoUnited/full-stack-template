---
name: server-observability
description: Add useful server diagnostics without leaking secrets or changing runtime semantics unexpectedly.
---

# Server observability

Read [server observability](../../../docs/server/observability.md).

- Use structured logs with stable event names and useful non-sensitive context.
- Log failures near their boundary, retain error causes, and avoid duplicate reports across layers.
- Never log credentials, access tokens, or unnecessary personal data.

