# Client testing

Run client unit tests from `client/` with `npm run test:unit`, `npm run test:unit:watch`, or `npm run test:unit:coverage`. These tests run in jsdom and do not need a Taito-managed stack.

Add a unit test only for meaningful client-only behavior such as branching, derived state, persistence, and accessibility-sensitive interaction. Rendering a component solely to prove that it displays the props it was given is not useful coverage. Render through Testing Library and assert visible behavior through roles, labels, and user interactions.

Do not mock fetch, application network clients, GraphQL/REST transport, or server behavior for client unit tests. Test server-boundary behavior through server integration/API or Playwright E2E tests. Do not mock or spy on internal hooks, contexts, or business-logic modules to force a component into isolation; mock only an unavailable DOM implementation or suppress an unrelated side effect.

Avoid testing framework/UI-kit internals, trivial prop pass-through, a test helper, or behavior already exercised through the real running client/server path. A useful test should survive an internal refactor that preserves the user's outcome.

Run `npm run test:unit` from `client/` while iterating, then `npm run verify` before handoff. Use `taito test:client:local` or the documented E2E flow when behavior requires the running stack.
