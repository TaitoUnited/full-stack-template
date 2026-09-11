---
name: typescript-conventions
description: Preserve the template's TypeScript structure, type safety, linting, and formatting conventions.
---

# TypeScript conventions

Read [code style](../../../docs/code-style.md) before modifying TypeScript.

- Prefer clear domain types, narrow external input from `unknown`, and named object parameters when a call has several values.
- Follow Oxlint and Oxfmt rather than adding competing style rules.
- Run `npm run verify` in the affected package after a change; add focused behavior tests when the package verification command does not cover them.
