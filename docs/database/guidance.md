# Database guidance

The server uses Drizzle and PostgreSQL. Keep persistence changes in the domain that owns the data: table and relation definitions in `server/src/<domain>/*.db.ts`, access in `*.dao.ts`, and domain behavior in `*.service.ts`.

- Make schema changes through Drizzle definitions, then generate a migration from `server/` with `npm run db:migrate:generate`.
- Review generated SQL before applying it. Apply only to the explicit local target with `taito exec:server:local npm run db:migrate` unless the user directs a remote rollout.
- Keep DAOs authorization-agnostic. Services authorize before database reads or writes.
- Use transactions and request-scoped database access where the existing setup provides them. Do not create ad-hoc pools in domain code.
- Treat recreating databases, importing dumps, and replacing data as destructive recovery operations. Confirm the exact local target and backup/recovery consequence first.

See [migrations](migration.md), [operations](operations.md), and [seeding](seeding.md) for procedures.
