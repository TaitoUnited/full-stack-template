---
name: server-architecture
description: Use for server domain boundaries, setup composition, resolvers, services, DAOs, or colocated-domain structure. Do not use for a narrow query, endpoint, or client-only change that preserves these boundaries.
---

# Server architecture

Read [server architecture](../../../docs/server/architecture.md).

- Organize each domain around resolver, service, DAO, and database responsibilities.
- Keep transport, business logic, and persistence concerns separate; inject infrastructure dependencies at setup boundaries.
- Preserve one-way dependencies: transports may use services, services may use DAOs, and DAOs may use database definitions. Do not add a controller layer or cross-domain barrel that obscures ownership.
- Pass request context to authorization-aware services and propagate its database handle to DAOs so request transactions and test fixtures remain effective.
- Add focused tests at the layer that owns the changed behavior.
