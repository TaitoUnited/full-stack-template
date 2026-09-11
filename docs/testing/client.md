# Client testing

Add unit tests for meaningful client-only behavior such as branching, derived state, persistence, and accessibility-sensitive interaction. Render through Testing Library and assert visible behavior through roles, labels, and user interactions.

Do not mock application network clients, GraphQL transport, or server behavior for client unit tests. Test server-boundary behavior through server integration/API or Playwright E2E tests. Avoid tests that only assert internal hook or collaborator calls.

Run `npm run test:unit` from `client/` while iterating, then `npm run verify` before handoff. Use `taito test:client:local` or the documented E2E flow when behavior requires the running stack.
