# Verification commands

Run checks from the owning package directory.

| Scope | Verification command |
| --- | --- |
| Client | `npm run verify` — generates artifacts, validates translations, runs static checks and unit tests, then builds |
| Server | `npm run verify` — generates artifacts, runs static checks, then builds |
| Playwright | `npm run verify` — runs lint, type checking, and format checking |
| Worker | `npm run verify` — runs lint, type checking, and format checking |

Verification does not replace behavior tests requiring the local stack. After cross-package changes, run `npm run verify` in every affected package and then the relevant Taito test target.
