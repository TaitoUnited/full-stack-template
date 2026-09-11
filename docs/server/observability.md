# Observability and error handling

Use the request-scoped structured logger for request work and the shared application logger only when no request context exists. Prefer structured fields with a stable message; include errors in structured error fields so stacks are retained.

Do not use console logging in request or domain code; startup, migration, and test tooling can use it deliberately. Never log secrets, tokens, cookies, authorization headers, GraphQL variables, or sensitive request/response payloads. Preserve accepted/generated request identifiers across transports, logs, and error responses.

Expected domain failures use the shared transport-aware error boundary. Unexpected failures are logged and reported once at the top-level boundary, then returned as a stable sanitized internal error.
