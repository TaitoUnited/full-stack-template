# full-stack-template | server

## Structure recommendations

### Layers

Responsibilities:

- Resolvers: Map GraphQL queries into service calls.
- Routers: Map REST queries into service calls.
- Services: Provide use case specific business logic.
- DAOs or Repositories: Provide reusable logic for data access and persistence.

NOTE: This template uses DAO pattern by default to give you all the power of PostgreSQL and to avoid a monolithic ORM model. However, do not misuse it by implementing bloated DAOs. Implement reusable DAO logic and keep use case specific logic in services, if it's possible.

### Modular implementation vs microservices

Instead of implementing small microservices from the day one, divide your implementation into 1-N fairly independent modules and place common logic in **common** folder. See the **core** module and the **common** folder as an example. This makes refactoring module boundaries and responsibilities easier at the beginning, but enables you to split the implementation into small microservices later, if such need arises. And of course, a really small server implementation typically consists of just one module (e.g. **core** module).

Use any folder structure you see fit inside your modules. The **core** module presents one example that is based on layers: resolvers -> services -> daos. If your module is very small, you may not need subfolders at all.

### Circular dependencies and event-based messaging

You should avoid circular dependencies between your modules. If you can't break a circular dependency by moving code to another module, you can try to use event-based messaging library instead (think of observer and publish/subscribe patterns). Event-based messaging also helps you to keep your modules more loosely coupled, which might improve maintainability in the long run.

EXAMPLE: When a new product is created by a **catalog** module, it publishes a _product created_ event. A **warehouse** module has subscribed to _product created_ events, and it adds product details required by the warehouse functionality to its own database tables when a product has been created.

### Splitting into microservices

Often there is no need to split a modular monolithic implementation into microservices. But if you choose to do so, one of the microservices should act as a GraphQL Gateway (see [Apollo Federation](https://www.apollographql.com/docs/federation/)). You should also replace the messaging library with some message broker (e.g. Redis, RabbitMQ, or Kafka). Note that when split into microservices, you cannot rely solely on transactions anymore. You may need additional fault tolerance mechanisms like dead letter queues, circuit breakers, etc. based on your business requirements.
