---
name: client-routing
description: Use for TanStack routes, navigation, loaders, route context, layouts, URL state, or client authentication guards. Do not use for server-side authentication or authorization enforcement.
---

# Client routing

Read [client routing](../../../docs/client/routing.md).

- Keep route definitions and route components in the established `client/src/routes/` structure.
- Put initial remote-data preloading in route loaders and retain typed route context; preserve pending/error boundaries at the level that owns the route.
- Do not hand-edit generated router output; regenerate it through the client build or generation command.
- Consider links, parameters, URL state, guards, loading, pending, and error states as one route change. Client guards improve navigation only; server services enforce access.
