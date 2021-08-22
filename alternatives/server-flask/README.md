# full-stack-template | server

## Structure recommendation

Instead of implementing small microservices from the day one, divide your implementation into 1-N fairly independent modules and place common logic in **common** folder (see the **core** and **integrations** example modules, and the **common** folder). This makes refactoring module boundaries and responsibilities easier, but enables you to split the implementation into small microservices later, if such need arises. And of course, a really small server implementation typically consists of just one module (the **core** module).

Use any folder structure you see fit inside your modules. The **core** and **integrations** example modules present just couple of alternative folder structures. And if your module is very small, you may not need subfolders at all.

For a large implementation you may also want to minimize direct dependencies between the modules both on the service and database level. You can do that by using some messaging library to communicate between the modules. For example, when a new product is created by a **catalog** module, it publishes a _product created_ event. A **warehouse** module has subscribed to _product created_ events, and it adds product details required by the warehouse functionality to its own database tables when a product has been created. Later if you split your implementation into separate microservices, you can replace the messaging library with some message broker (e.g. Redis, RabbitMQ, or Kafka). Note that when split into microservices, you cannot rely solely on transactions anymore. You may need additional fault tolerance mechanisms like dead letter queues, circuit breakers, etc. based on your business requirements.

If or when you split your implementation into microservices, one of the microservices should act as a GraphQL Gateway (see [Apollo Federation](https://www.apollographql.com/docs/federation/)). You most likely need also a message broker, as mentioned earlier.
