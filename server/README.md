# full-stack-template | server

## Structure recommendation

Instead of implementing small microservices from the day one, divide your implementation into 1-N fairly independent modules and place common logic in **common** folder. See the **core** module and the **common** folder as an example. This makes refactoring module boundaries and responsibilities easier at the beginning, but enables you to split the implementation into small microservices later, if such need arises. And of course, a really small server implementation typically consists of just one module (e.g. **core** module).

Use any folder structure you see fit inside your modules. The **core** module presents one example that is based on layers: resolvers -> services -> daos. If your module is very small, you may not need subfolders at all.

You should avoid circular dependencies between your modules. One way to break a circular dependency is to use event-based messaging library (think of observer and publish/subscribe patterns). Event-based messaging also helps you to keep your modules more loosely coupled, which might improve maintainability in the long run. For example, when a new product is created by a **catalog** module, it publishes a _product created_ event. A **warehouse** module has subscribed to _product created_ events, and it adds product details required by the warehouse functionality to its own database tables when a product has been created. Later if you split your implementation into separate microservices, you can replace the messaging library with some message broker (e.g. Redis, RabbitMQ, or Kafka). Note that when split into microservices, you cannot rely solely on transactions anymore. You may need additional fault tolerance mechanisms like dead letter queues, circuit breakers, etc. based on your business requirements.

If you split your implementation into microservices, one of the microservices should act as a GraphQL Gateway (see [Apollo Federation](https://www.apollographql.com/docs/federation/)). You most likely need also a message broker, as mentioned earlier.
