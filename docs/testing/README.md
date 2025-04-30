# Testing

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
> All tests are run inside a Docker container. This means that you need to have
> the application stack running with `taito start` before you can run the tests.

We run all tests in the CI pipeline but you can also run them locally with taito CLI.

You can run all tests with the following command:

```sh
taito test:server
```

<!-- TODO: links -->

## Client

We are using [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/) for unit testing on the client side. Vitest is a fast and lightweight test runner, while Testing Library provides utilities to test UI components in a user-centric way.

<!-- TODO: links -->
