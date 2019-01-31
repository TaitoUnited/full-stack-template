# Cypress tests

> NOTE: Cypress tests are not currently run by CI, because of an connection timeout problem that might be related to [this issue](https://github.com/cypress-io/cypress/issues/1639).

This folder contains Cypress tests.

Open Cypress user interface for running tests locally:

    taito cypress                           # open cypress for default target (client)
    taito cypress:client                    # open cypress for client
    taito cypress:admin                     # open cypress for admin

Open Cypress user interface for running tests on remote dev environment:

    taito cypress:dev                       # open cypress for default target (client)
    taito cypress:client:dev                # open cypress for client
    taito cypress:admin:dev                 # open cypress for admin

> NOTE: If your tests need a database connection, start a proxy with `taito db proxy:dev`.

Run tests in container using headless mode (against local environment):

    taito test:client cypress               # run the cypress test suite of client
    taito test:client cypress posts         # run the 'posts' test of the cypress test suite of client
    taito test:client cypress 'pos*'        # run all tests of cypress test suite named pos*

Run tests in container using headless mode (against remote dev environment):

    taito test:client:dev cypress           # run the cypress test suite of client
    taito test:client:dev cypress posts     # run the 'posts' test of the cypress test suite of client
    taito test:client:dev cypress 'pos*'    # run all tests of cypress test suite named pos*

> TIP: Testing personnel can run Cypress against any remote environment without Taito CLI: `cd client && npm install && npm run cypress:open`. The target app url is configured in `cypress.json` file. If, however, some of the cypress tests also use a direct database connection, user must also start a database proxy and configure database connection settings in `client/test/db.json`.
