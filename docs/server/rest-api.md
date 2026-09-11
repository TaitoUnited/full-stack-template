# REST and OpenAPI guidance

Keep REST modules thin and put domain behavior and authorization in services. Define request, parameter, and response schemas through the server's established schema mechanism; do not maintain a second handwritten API contract.

Give every route an explicit authentication mode. Keep OpenAPI/Swagger exposure controlled by central configuration and do not include tokens, secrets, sensitive production values, or internal error details in examples.

Use integration tests for detailed behavior and representative API tests to prove routing, validation, and authentication are wired through the running transport.
