# Database guidance

The server uses Drizzle and PostgreSQL. Keep persistence changes in the domain that owns the data: table and relation definitions in `server/src/<domain>/*.db.ts`, access in `*.dao.ts`, and domain behavior in `*.service.ts`.

## Connections and transactions

Request work uses the setup-provided database handle. Pass that handle through services and DAOs so a request transaction and test fixture remain effective. Do not create another pool, keep a checked-out client in request/global state, or bypass the supplied transaction.

Use a transaction for a multi-write invariant, and execute every participating query through the same transaction object. Standalone tooling such as migrations may use its own task-scoped connection, but must close it reliably and must not share request-timeout assumptions.

## Queries and schema changes

Use Drizzle's explicit query builder in DAOs. Keep joins and related-record queries explicit; foreign-key definitions remain the source of relationship integrity. Avoid adding a second relational data-access style merely for convenience.

- Make schema changes through Drizzle definitions, then generate a migration from `server/` with `npm run db:migrate:generate`.
- Review generated SQL before applying it. Apply only to the explicit local target with `taito exec:server:local npm run db:migrate` unless the user directs a remote rollout.
- Keep DAOs authorization-agnostic. Services authorize before database reads or writes.
- Use transactions and request-scoped database access where the existing setup provides them. Do not create ad-hoc pools in domain code.
- Treat recreating databases, importing dumps, and replacing data as destructive recovery operations. Confirm the exact local target and backup/recovery consequence first.
- Call out migrations that delete data, invalidate sessions, rebuild large indexes, or otherwise impose a material operational cost. Plan compatibility and staged rollout before applying them.

See [migrations](migration.md), [operations](operations.md), and [seeding](seeding.md) for procedures.
