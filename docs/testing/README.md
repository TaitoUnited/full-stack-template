# Testing

Use [client testing](client.md), [server testing](server.md), [E2E testing](e2e.md), and [verification commands](verification.md) to choose the right test boundary and command.

<!-- TODO: Write global testing intro -->

## Server

There are three main types of tests that you should write for the server:

1. Unit tests for testing individual functions and modules.
2. Integration tests for domain specific controllers.
3. API tests for testing the GraphQL and REST API endpoints.

The [Vitest](https://vitest.dev/) test runner is configured to run the specific
type of tests based on an env variable `MODE=unit|integration|api` which then configures
the target filename suffix: `.test.unit.ts`, `.test.integration.ts`, or `.test.api.ts`.

All three types of tests should be co-located with the code they are testing.

> [!IMPORTANT]
> Tests are run inside the Taito-managed server test target. Unit tests need no
> runtime dependencies. Integration and API tests create, migrate, and drop a
> disposable database for each run; API tests also start an isolated server on a
> random port. The local database service must be available, but tests do not use
> an already-running application server or the application database.

We run all tests in the CI pipeline but you can also run them locally with taito CLI.

You can run all tests with the following command:

```sh
taito test:server:local
```

<!-- TODO: links -->

## Client

We are using [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/) for unit testing on the client side. Vitest is a fast and lightweight test runner, while Testing Library provides utilities to test UI components in a user-centric way.

<!-- TODO: links -->
