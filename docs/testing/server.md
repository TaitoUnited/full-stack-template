# Server testing

Use unit tests for pure logic and narrow local behavior. Use integration tests for services, authorization, persistence, transactions, and error mapping. Use API tests only for representative transport wiring through the running application.

Prefer real local dependencies where the behavior under test crosses a database, authentication, or transport boundary. Keep mocks at genuine external-system boundaries, not between internal layers. Add both success and relevant failure/authorization cases for changed domain behavior.

Run focused tests while iterating, then use the applicable `taito test:server:local` suite and `npm run verify` in `server/`.
