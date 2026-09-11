# Server integrations

Keep third-party clients behind a small integration boundary with configuration, authentication, timeouts, retry behavior, and error translation in one place. Validate external responses before domain use and do not let provider-specific types leak across the domain.

Centralize token refresh and persistence rather than duplicating it in provider-facing services. Keep least-privilege service and user authorization flows distinct, and distinguish missing/revoked authorization from unrelated provider or network failures.

Never log credentials, raw authorization headers, or full sensitive provider payloads. Make retry and idempotency behavior explicit before adding background or webhook workflows. Test provider boundaries with deterministic fakes only when a real local integration is unavailable; keep services, DAOs, encryption, and database behavior real around the mock boundary. Never make live provider calls from automated tests.
