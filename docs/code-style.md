# Code style

Use the repository's automated checks as the source of truth. Oxlint enforces correctness, imports, TypeScript, React, and project-local rules; Oxfmt owns formatting. Do not add formatter or linter suppressions merely to preserve an old style unless the surrounding framework contract genuinely requires it.

## TypeScript

- Prefer named exports, `type` aliases, explicit domain names, and direct functions over broad abstractions.
- Use a named object parameter for functions with more than two inputs or two easily swapped values of the same type.
- Keep external data as `unknown` until it is validated. Do not use assertions to bypass validation.
- Use `node:` imports for Node built-ins and do not introduce cyclic imports or broad barrel imports that obscure ownership.

## Client

- Use semantic HTML and existing React Aria/UI-kit controls.
- Keep route state in TanStack Router and server state in Apollo Client. Do not duplicate either in local component state.
- Use Lingui for static user-facing strings. Keep generated GraphQL, Panda, locale, and sprite output out of manual edits.

## Server

- Keep resolvers and REST routes thin. Put domain behavior and authorization in services, database access in DAOs, and table definitions in `*.db.ts` modules.
- Use the shared logging and error boundaries. Do not use `console` in request or domain code, or log credentials and sensitive payloads.

Run `npm run verify` from the affected package after changes; run focused tests appropriate to the changed behavior when they are not included by that package's verification command.
