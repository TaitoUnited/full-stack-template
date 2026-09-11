# GraphQL API guidance

The server builds a code-first GraphQL schema. Define domain schema and resolver modules beside their domain, register them through central schema setup, and keep resolver code limited to transport validation, service calls, and necessary result mapping.

- Root fields should choose authentication deliberately. Services still enforce domain permissions.
- Return changed entities from mutations when possible so Apollo can update normalized cache; for deletion return the deleted identifier or pre-deletion data.
- Keep inputs required and fields non-null by default, with explicit exceptions.
- Use the request-scoped database handle. Expected failures go through the shared error boundary; unexpected/database errors remain internal and are sanitized before reaching clients.
- Avoid N+1 behavior in nested field resolvers. Use a request-scoped loader or set-based DAO query only where repeated resolution justifies it.

After schema changes, run the configured GraphQL generation/check commands and add focused API coverage when transport wiring needs verification.
