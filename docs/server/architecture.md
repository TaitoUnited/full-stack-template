# Server architecture

Setup modules compose transports, authentication, request context, logging, and infrastructure lifecycle. Resolvers and REST route modules are transport adapters: validate/map their input, then call a service. Services contain domain behavior and authorization; DAOs contain database access; `*.db.ts` modules own tables and relations.

Keep dependency direction one-way: transports may depend on services, services on DAOs, and DAOs on database definitions. Avoid domain modules reaching into setup code and do not introduce cross-domain barrels that hide ownership or create cycles.

Keep resolvers thin and test domain behavior through integration tests. Pass the request context into authorization-aware services and preserve the request-scoped database handle so transactions and tests remain effective.
