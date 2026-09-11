# REST and OpenAPI guidance

Keep REST modules thin and put domain behavior and authorization in services. Define request, parameter, and response schemas through the server's established schema mechanism; do not maintain a second handwritten API contract.

Give every route an explicit authentication mode, including operational and documentation endpoints. Register OpenAPI schema before documented routes and keep exposure controlled by central configuration. Do not include tokens, secrets, sensitive production values, or internal error details in examples.

Expected failures use shared transport-aware errors; validation can be a client error, but database and unexpected exception details remain internal. Use integration tests for detailed behavior and representative API tests to prove routing, validation, and authentication are wired through the running transport.
