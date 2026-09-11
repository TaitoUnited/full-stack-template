# Server integrations

Keep third-party clients behind a small integration boundary with configuration, authentication, timeouts, retry behavior, and error translation in one place. Validate external responses before domain use and do not let provider-specific types leak across the domain.

Never log credentials, raw authorization headers, or full sensitive provider payloads. Make retry and idempotency behavior explicit before adding background or webhook workflows. Test provider boundaries with deterministic fakes only when a real local integration is unavailable; keep domain behavior tests independent of the provider client.
