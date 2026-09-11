# Server testing

Run server suites from the repository root through the local stack: `taito test:server:local unit`, `taito test:server:local integration`, `taito test:server:local api`, or `taito test:server:local` for all server suites. The stack must be running; do not replace integration/API suites with host-side npm commands because the container supplies their environment, networking, and secrets.

Use `*.test.integration.ts` by default for service behavior, validation, authorization, persistence, state transitions, and error mapping. Use REST/GraphQL API tests only for representative real-request transport wiring. Reserve unit tests for complex pure utilities or unavoidable third-party boundaries; do not unit-test services.

Prefer real local dependencies where behavior crosses database, authentication, or transport boundaries. Never mock or spy on application configuration, permissions, DAOs, services, or the database. Mock only unavoidable third-party network calls, and assert the application's mapping, validation, persistence, or error outcome rather than values configured in a mock.

Keep per-test state in fixtures or helper callbacks, use unique values for unique constraints, and clean external/global resources rather than ordinary disposable-database rows. Tests should assert observable data, authorization, errors, redirects, cookies, or translated provider failures—not call counts or private implementation details.

Run focused tests while iterating, then use the applicable `taito test:server:local` suite and `npm run verify` in `server/`.
