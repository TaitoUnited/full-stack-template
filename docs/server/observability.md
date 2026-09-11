# Observability and error handling

Use the request-scoped structured logger for request work and the shared application logger only when no request context exists. Prefer structured fields with a stable message; include errors in structured error fields so stacks are retained.

Do not use console logging in request or domain code. Never log secrets, tokens, cookies, authorization headers, or sensitive request/response payloads. Preserve request identifiers across transports and error responses.

Expected domain failures use the shared transport-aware error boundary. Unexpected failures are logged and reported once at the top-level boundary, then returned as a stable sanitized internal error.
