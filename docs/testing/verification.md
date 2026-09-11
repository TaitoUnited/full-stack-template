# Verification commands

Run checks from the owning package directory.

| Scope | Verification command |
| --- | --- |
| Client | `npm run verify` — generates artifacts, validates translations, runs static checks and unit tests, then builds |
| Server | `npm run verify` — generates artifacts, runs static checks, then builds |
| Playwright | `npm run verify` — runs lint, type checking, and format checking |
| Worker | `npm run verify` — runs lint, type checking, and format checking |

Verification does not replace behavior tests requiring the local stack. After cross-package changes, run `npm run verify` in every affected package and then the relevant Taito test target.

Use the smallest composite command that covers the changed package while iterating, then run the complete applicable verification before handoff. After a source-level change, behavior checks remain conditional: server integration/API suites need the local stack, and Playwright verifies flows that cross the running client/server boundary.

The package `verify` commands intentionally own generation, static analysis, package-local tests, and builds—not remote deployment state. Keep CI source verification aligned with the same commands rather than reimplementing individual lint/typecheck/format steps in separate automation.
