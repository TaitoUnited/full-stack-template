# Development

This file has been copied from [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/SERVER-TEMPLATE/blob/dev/DEVELOPMENT.md) instead. Project specific conventions are located in [README.md](README.md#conventions). See the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for more thorough development instructions. Note that Taito CLI is optional (see [without Taito CLI](#without-taito-cli)).

Table of contents:

* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Automated tests](#automated-tests)
* [Code structure](#code-structure)
* [Version control](#version-control)
* [Database migrations](#database-migrations)
* [Deployment](#deployment)
* [Configuration](#configuration)
* [Without Taito CLI](#without-taito-cli)

## Prerequisites

* [node.js](https://nodejs.org/)
* [docker-compose](https://docs.docker.com/compose/install/)
* Optional: [Taito CLI](https://github.com/TaitoUnited/taito-cli#readme)
* Optional: eslint and prettier plugins for your code editor

## Quick start

Install linters and some libraries on host for code autocompletion purposes (add `--clean` to make a clean reinstall):

    taito install

Start containers (add `--clean` to make a clean rebuild, and to discard all data and db tables):

    taito start

Make sure that everything has been initialized (e.g database) (add `--clean` to make a clean reinit):

    taito init

Open app in browser:

    taito open app

Open admin GUI in browser:

    taito open admin

Open API in browser:

    taito open api

Show user accounts and other information that you can use to log in:

    taito info

Access database:

    taito db connect                        # access using a command-line tool
    taito db proxy                          # access using a database GUI tool
                                            # look docker-compose.yaml for database user credentials
    taito db import: ./database/file.sql    # import a sql script to database

Run tests:

    taito unit                              # run all unit tests
    taito unit:server                       # run unit tests of server
    taito unit:server trip                  # run the 'trip' unit test of server
    taito test                              # run all integration and end-to-end tests
    taito test:client                       # run integration and end-to-end tests of client
    taito test:client cypress               # run the cypress test suite of client
    taito test:client cypress posts         # run the 'posts' test of the cypress test suite of client
    taito test:client cypress 'pos*'        # run all tests of cypress test suite named pos*

Open Cypress user interface:
    taito cypress                           # open cypress for default target (client)
    taito cypress:client                    # open cypress for client
    taito cypress:admin                     # open cypress for admin

> TIP: Testing personnel may run Cypress against any remote environment without Taito CLI or docker. See `client/test/README.md` for more instructions.

Start shell on a container:

    taito shell:admin
    taito shell:client
    taito shell:server

Stop containers:

    taito stop

List all project related links and open one of them in browser:

    taito open -h
    taito open NAME

Check bundle size and dependencies:

    taito check size
    taito check size:client
    taito check deps
    taito check deps:server
    taito check deps:server -u             # update packages interactively
    taito check deps:server -y             # update all packages (non-iteractive)

> NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused. But all unused `dependencies` can usually be removed from package.json.

Cleaning:

    taito clean:admin                       # Remove admin container image
    taito clean:client                      # Remove client container image
    taito clean:server                      # Remove server container image
    taito clean:database                    # TODO: does not work
    taito clean:npm                         # Delete node_modules directories
    taito clean                             # Clean everything

The commands mentioned above work also for server environments (`f-NAME`, `dev`, `test`, `stag`, `canary`, `prod`). Some examples for dev environment:

    taito --auth:dev                        # Authenticate to dev
    taito open app:dev                      # Open application in browser
    taito open admin:dev                    # Open admin GUI in browser
    taito info:dev                          # Show info
    taito status:dev                        # Show status of dev environment
    taito open builds                       # Show build status and logs
    taito test:dev                          # Run integration and e2e tests
    taito cypress:client:dev                # Open cypress for client
    taito shell:server:dev                  # Start a shell on server container
    taito logs:server:dev                   # Tail logs of server container
    taito open logs:dev                     # Open logs on browser
    taito open storage:dev                  # Open storage bucket on browser
    taito init:dev --clean                  # Clean reinit for dev environment
    taito db connect:dev                    # Access database on command line
    taito db proxy:dev                      # Start a proxy for database access
    taito secrets:dev                       # Show secrets (e.g. database user credentials)
    taito db rebase:dev                     # Rebase database by redeploying all migrations
    taito db import:dev ./database/file.sql # Import a file to database
    taito db dump:dev                       # Dump database to a file
    taito db log:dev                        # Show database migration logs
    taito db revert:dev XXX                 # Revert database to change XXX
    taito db deploy:dev                     # Deploy data migrations to database
    taito db recreate:dev                   # Recreate database
    taito db diff:dev test                  # Show diff between dev and test schemas
    taito db copy between:test:dev          # Copy test database to dev

Run `taito -h` to get detailed instructions for all commands. Run `taito COMMAND -h` to show command help (e.g `taito vc -h`, `taito db -h`, `taito db import -h`). For troubleshooting run `taito --trouble`. See [README.md](README.md) for project specific conventions and documentation.

> If you run into authorization errors, authenticate with the `taito --auth:ENV` command.

> It's common that idle applications are run down to save resources on non-production environments. If your application seems to be down, you can start it by running `taito start:ENV`, or by pushing some changes to git.

## Automated tests

> HINT: You should not test implementation in your test scripts. Instead, you should always find some kind 'public API' that is designed not to change very often, and you should test behaviour of that API. Here public API can be provided by class, module, library, service or UI, for example. This way you can make changes to the underlying implementation, and the existing tests protect you from breaking anything.

### Unit tests

All unit tests are run automatically during build (see the `Dockerfile.build` files). You can use any test tools that have been installed as development dependency inside the container. If the test tools generate reports, they should be placed at the `/service/test/reports` (`./test/reports`) directory inside the container. You can run unit tests manually with the `taito unit` command (see help with `taito unit -h`).

### Integration and end-to-end tests

All integration and end-to-end test suites are run automatically after application has been deployed to dev environment. You can use any test tools that have been installed as development dependency inside the `builder` container (see `Dockerfile.build`). You can specify your environment specific test settings in `taito-config.sh` using `test_` as prefix. You can access database in your tests as database proxy is run automatically in background (see `docker-compose-test.yaml`). If the test tools generate reports, screenshots or videos, they should be placed at the `/service/test/reports`, `/service/test/screenshots` and `/service/test/videos` directories.

Tests are grouped in test suites (see the `test-suites` files). All test suites can be kept independent by cleaning up data before each test suite execution by running `taito init --clean`. You can enable data cleaning in `taito-config.sh` with the `ci_exec_test_init` setting, but you should use it for dev environment only.

You can run integration and end-to-end tests manually with the `taito test[:TARGET][:ENV] [SUITE] [TEST]` command, for example `taito test:server:dev`. When executing tests manually, the development container (`Dockerfile`) is used for executing the tests.

> Once you have implemented your first integration or e2e test, enable the CI test execution by setting `ci_exec_test=true` for dev environment.

## Code structure

Project specific conventions are defined in [README.md](README.md#conventions). See [software design](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/b-software-design.md) appendix of the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for some tips on how to design a modular directory structure.

## Version control

Development is done in `dev` and `feature/*` branches. Hotfixes are done in `hotfix/*` branches. You should not commit changes to any other branch.

All commit messages must be structured according to the [Angular git commit convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) (see also [Conventional Commits](http://conventionalcommits.org/)). This is because application version number and release notes are generated automatically for production release by the [semantic-release](https://github.com/semantic-release/semantic-release) library.

> You can also use `wip` type for such feature branch commits that will be squashed during rebase.

You can manage environment and feature branches using Taito CLI commands. Run `taito vc -h` for instructions. If you use git commands or git GUI tools instead, remember to follow the version control conventions defined by `taito vc conventions`. See [version control](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/03-version-control.md) chapter of the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for some additional information.

## Database migrations

Add a new migration:

1. Add a new step to migration plan:

    `taito db add: NAME`, for example: `taito db add: role_enum`

2. Modify database/deploy/NAME.sql, database/revert/NAME.sql and database/verify/NAME.sql

3. Deploy the change to your local database:

    `taito db deploy`

The CI/CD tool will deploy your database changes automatically to servers once you push your changes to git. Database migrations are executed using sqitch. More instructions on sqitch: [Sqitch tutorial](https://metacpan.org/pod/sqitchtutorial)

> If environments do not yet contain any permanent database data, you can just edit the existing deploy sql files directly and run `taito init:ENV --clean` before deploying the app to an environment. It is recommended to edit the files directly until the first production version has been released to keep migration files clean. However, if you delete some of the existing `deploy/*.sql` files, leave revert scripts in place. Otherwise `taito init:ENV --clean` will fail because changes cannot be reverted.

> It is recommended that you put a table name at the beginning of your migration script name. This way the table creation script and all its alteration scripts remain close to each other in the file hierarchy.

> REMINDER: Do not forget indexing. Once in a while you should review sql queries made by the application and check that essential indexes are in place in the database.

## Deployment

Container images are built for dev and feature branches only. Once built and tested successfully, the container images will be deployed to other environments on git branch merge:

* **f-NAME**: Push to the `feature/NAME` branch.
* **dev**: Push to the `dev` branch.
* **test**: Merge changes to the `test` branch using fast-forward.
* **stag**: Merge changes to the `stag` branch using fast-forward.
* **canary**: Merge changes to the `canary` branch using fast-forward. NOTE: Canary environment uses production resources (database, storage, 3rd party services) so be careful with database migrations.
* **prod**: Merge changes to the `master` branch using fast-forward. Version number and release notes are generated automatically by the CI/CD tool.

Simple projects require only two environments: **dev** and **prod**. You can list the environments with `taito vc env list`.

You can use the `taito vc` commands to manage branches, and the `taito deployment` commands to manage builds and deployments. Run `taito vc -h` and `taito deployment -h` for instructions. Run `taito open builds` to see the build logs. See [version control](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/03-version-control.md) chapter of the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for some additional information.

> Automatic deployment might be turned off for critical environments (`ci_exec_deploy` setting in `taito-config.sh`). In such case the deployment must be run manually with the `taito -a deployment deploy:prod VERSION` command using a personal admin account after the CI/CD process has ended successfully.

## Configuration

> TIP: To save some time, start your application locally while you are configuring the project: `taito install`, `taito start`, `taito init`.

### Version control settings

Run `taito open vc conventions` in the project directory to see organization specific settings that you should configure for your git repository.

### Stack

**Alternative technologies:** If you would rather use other technologies than React, Node.js and PostgreSQL, you can copy alternative example implementations from [alternatives](https://github.com/TaitoUnited/SERVER-TEMPLATE/tree/master/admin) directory.

**Additional microservices:** The template supports unlimited number of microservices. You can add a new microservice like this:

  1. Create a new directory for your service. Look [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) and [SERVER-TEMPLATE-alt](https://github.com/TaitoUnited/SERVER-TEMPLATE-alt/) for examples.
  2. Add the service to `taito_targets` variable in `taito-config.sh`
  3. Add the service to `docker-compose.yaml` and check that it works ok in local development environment.
  4. Add the service to `scripts/helm.yaml`.
  5. Add the service to `package.json` scripts: `install-all`, `lint`, `unit`, `test`, `check-deps`, `check-size`.
  6. Add the service to `cloudbuild.yaml`.

**Flow/TypeScript:** You can enable Flow or TypeScript by going through parts marked with a `NOTE: for flow` or `NOTE: for typescript` note. (TODO: implement typescript support)

**Minikube:** If you would rather use minikube for local development instead of docker-compose, remove `docker-compose:local` plugin, and the `:-local` restriction from `kubectl:-local` and `helm:-local` plugins. These are configured with the `taito_plugins` setting in `taito-config.sh`. (TODO: Not tested on minikube yet. Probably needs some additional work.)

**Authentication:** Authentication has not yet been implemented to the template (see [issue](https://github.com/TaitoUnited/SERVER-TEMPLATE/issues/11)). Currently ingress does provide basic authentation, but it is only meant for hiding non-production environments. [Auth0 docs](https://auth0.com/docs) is a good starting point for your auth implementation.

### Examples

The project template comes with a bunch of implementation examples. Browse the examples through, leave the ones that seem useful and remove all the rest. You can use the `taito check deps` command to prune unused dependencies. NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused by the tool. But all unused `dependencies` may usually be removed from package.json.

The client GUI uses [Material-UI](https://material-ui-next.com/) component library by default. It's a good match with the [react-admin](https://github.com/marmelab/react-admin) GUI, but please consider also other alternatives based on customer requirements. For example [Elemental](http://elemental-ui.com/) is a good alternative.

### Basic project settings

1. Modify `taito-config.sh` if you need to change some settings. The default settings are ok for most projects.
2. Run `taito project apply`
3. Commit and push changes

### Remote environments

Define remote environments with the `taito_environments` setting in `taito-config.sh`. Make sure that your authentication is in effect for an environment with `taito --auth:ENV`, and then create an environment by running `taito env apply:ENV`. Examples for environment names: `f-orders`, `dev`, `test`, `stag`, `canary`, `prod`. Create a `dev` environment first, and the other environments later if required.

If basic auth (htpasswd) is used only for hiding non-production environments, you can use the same credentials for all environments. In such case you should also write them down to the [links](README.md#links) section on README.md so that all project personnel can easily access the credentials.

> If you have some trouble creating an environment, you can destroy it by running `taito env destroy:ENV` and then try again with `taito env apply:ENV`.

> See [6. Remote environments](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/05-remote-environments.md) chapter of Taito CLI tutorial for more thorough instructions.

> Operations on production and staging environments usually require admin rights. Please contact DevOps personnel if necessary.

### Kubernetes

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. By modying these files you can easily configure environment variables, resource requirements and autoscaling for your containers.

You can deploy configuration changes without rebuilding with the `taito deployment deploy:ENV` command.

> Do not modify the helm template located in `./scripts/helm` directory. Improve the original helm template located in [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) repository instead.

### Secrets

1. Add a secret definition to the `taito_secrets` setting in `taito-config.sh`.
2. Map the secret definition to an environment variable in `scripts/helm.yaml`
3. Run `taito env rotate:ENV SECRET` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

> For local development you can just define secrets as normal environment variables in `docker-compose.yaml` given that they are not confidential.

### Upgrading to the latest version of the project template

Run `taito project upgrade`. The command copies the latest versions of reusable Helm charts, terraform templates and CI/CD scripts to your project folder, and also this README.md file. You should not make project specific modifications to them as they are designed to be reusable and easily configurable for various needs. Improve the originals instead, and then upgrade.

### Without Taito CLI

You can use this template also without Taito CLI.

**Local development:**

    npm install              # Install a minimal set of libraries on host
    npm run install-dev      # Install more libraries on host (for editor autocompletion/linting)
    docker-compose up        # Start the application
    npm run sqitch (TODO)    # Run database migrations (requires Sqitch installed on host)
    -> http://localhost:9999 # Open the application on browser (the port is defined in docker-compose.yaml)

    psql / mysql ...         # Use psql or mysql to operate your database (requires psql/mysql installed on host)
                             # DB port and credentials are defined in docker-compose.yaml
                             # Example local development data is located in 'database/data/local.sql'
    npm run ...              # Use npm to run npm scripts ('npm run' shows all the scripts)
    docker-compose ...       # Use docker-compose to operate your application
    docker ...               # Use docker to operate your containers

**Testing:**

Testing personnel may run Cypress against any remote environment without Taito CLI or docker. See `client/test/README.md` for more instructions.

**Environments and CI/CD:**

Taito CLI supports various infrastructures and technologies out-of-the-box, and you can also extend it by writing custom plugins. If you for some reason want to setup the application environments or run CI/CD steps without Taito CLI, you can write the scripts yourself by using the environment variable values defined in `taito-config.sh`.

Creating an environment:

* Use Terraform to create an environment, if your application requires some application specific external resources like storage buckets. Terraform scripts are located at `scripts/terraform/`. Note that the scripts assume that a cloud provider project defined by `taito_resource_namespace` and `taito_resource_namespace_id` already exists and Terraform is allowed to create resources for that project.
* Create a relational database (or databases) for an environment e.g. by using cloud provider web UI. See `db_*` settings in `taito-config.sh` for database definitions. Create two user accounts for the database: `SERVER_TEMPLATE_ENV` for deploying the database migrations (broad user rights) and `SERVER_TEMPLATE_ENV_app` for the application (concise user rights). Configure also database extensions if required by the application (see `database/db.sql`).
* Set Kubernetes secret values with `kubectl`. The secrets are defined by `taito_secrets` in `taito-config.sh`, and they are referenced in `scripts/helm*.yaml` files.

Deploying the application:

* Build all container images with [Docker](https://www.docker.com/) and push them to a Docker image registry.
* Deploy database migrations with [Sqitch](http://sqitch.org/). Sqitch scripts are located in `database/`.
* Deploy application to Kubernetes with [Helm](https://helm.sh/). Helm templates are located in `scripts/helm/` and environment specific values are located in `scripts/helm*.yaml`. Note that Helm does not support environment variables in value yaml files (this feature is implemented in the Taito CLI Helm plugin). Therefore you need to create a separate `scripts/heml-ENV.yaml` file for each environment and use hardcoded values in each.
* Optional: Run automatic integration and e2e tests
* Optional: Revert migrations and deployment if some of the tests fail.
* Optional: Generate documentation and other artifacts, and publish them
* Optional: Make a production release with semantic-release (see `package.json`)
