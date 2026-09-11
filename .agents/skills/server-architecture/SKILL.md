---
name: server-architecture
description: Maintain the template's domain-oriented server layering and dependency direction.
---

# Server architecture

Read [server architecture](../../../docs/server/architecture.md).

- Organize each domain around resolver, service, DAO, and database responsibilities.
- Keep transport, business logic, and persistence concerns separate; inject infrastructure dependencies at setup boundaries.
- Add focused tests at the layer that owns the changed behavior.

