# Integration tests

<!-- TODO: Write this up -->

## Module tests

Integration tests are used to test individual domain specific controllers without
having to fire a real HTTP request. This is useful for testing the business logic
of the controller without having to worry about the HTTP routing layer.

You can run integration tests with the following command:

```sh
taito test:server integration
```

## API tests

API tests are used to test the GraphQL and REST API endpoints by firing real HTTP
requests and checking the response data.

You can run them the following command:

```sh
taito test:server api
```
