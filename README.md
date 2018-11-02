# server-template

[//]: # (TEMPLATE NOTE START)

Server-template is a project template for applications and APIs running on server. The server-template is based on running containers on docker-compose or Kubernetes, but in the future it will also provide support for running functions on top of popular FaaS platforms. Thus, you can deploy the same implementation almost anywhere, and you can operate it with the same *taito-cli* commands regardless of the underlying platform.

The template comes with an example implementation that is based on React, Node.js, Postgres and S3, but you can easily replace them with other technologies (see [server-template-alt](https://github.com/TaitoUnited/server-template-alt)).

You can create a new project from this template by running `taito project create: server-template`. Later you can upgrade your project to the latest version of the template by running `taito project upgrade`. To ensure flawless upgrade, do not modify files that have a **do-not-modify** note in them as they are designed to be reusable and easily configurable for various needs. In such case, improve the original files of the template instead, and then upgrade.

You can also migrate an existing non-taito-cli project by running `taito project migrate: server-template` in your project root folder. If, however, you are not going to use docker containers or functions on your production environment, see the [legacy-server-template](https://github.com/TaitoUnited/legacy-server-template) instead.

[//]: # (TEMPLATE NOTE END)

Project specific documentation is located in [PROJECT.md](PROJECT.md). Remember to update it if you make changes related to architecture, integrations, or processing of personal data (GDPR).

Table of contents:

* [Links](#links)
* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Automated tests](#automated-tests)
* [Structure](#structure)
* [Version control](#version-control)
* [Database migrations](#database-migrations)
* [Deployment](#deployment)
* [Configuration](#configuration)

## Links

Non-production basic auth credentials: TODO

[//]: # (GENERATED LINKS START)

LINKS WILL BE GENERATED HERE

[//]: # (GENERATED LINKS END)

> You can update this section by configuring links in `taito-config.sh` and running `taito project docs`.

## Prerequisites

* [node.js](https://nodejs.org/)
* [docker-compose](https://docs.docker.com/compose/install/)
* Optional: [taito-cli](https://github.com/TaitoUnited/taito-cli#readme)
* Optional: eslint and prettier plugins for your code editor

## Quick start

> See the [taito-cli tutorial](https://github.com/TaitoUnited/taito-cli/tree/master/docs/tutorial) for more thorough examples. You can run some of these commands also [without taito-cli](#without-taito-cli).

Install linters and some libraries on host (add `--clean` for clean reinstall):

    taito install

Start containers (add `--clean` for clean rebuild):

    taito start

Make sure that everything has been initialized (e.g database) (add `--clean` for clean reinit):

    taito init

Open app in browser:

    taito open app

Open admin GUI in browser:

    taito open admin

Show user accounts and other information that you can use to log in:

    taito info

Access database:

    taito db connect                        # access using a command-line tool
    taito db proxy                          # access using a database GUI tool
    taito db import: ./database/file.sql    # import a sql script to database

Run tests:

    taito unit                              # run all unit tests
    taito unit:server                       # run unit tests of server
    taito unit:server trip                  # run the 'trip' unit test of server
    taito test                              # run all integration and end-to-end tests
    taito test:client                       # run integration and end-to-end tests of client
    taito test:client billing receipt       # run the receipt test of billing test suite of client

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

    taito open app:dev                      # Open application in browser
    taito open admin:dev                    # Open admin GUI in browser
    taito info:dev                          # Show info
    taito status:dev                        # Show status of dev environment
    taito open builds                       # Show build status and logs
    taito test:dev                          # Run integration and e2e tests
    taito shell:server:dev                  # Start a shell on server container
    taito logs:server:dev                   # Tail logs of server container
    taito open logs:dev                     # Open logs on browser
    taito open storage:dev                  # Open storage bucket on browser
    taito init:dev --clean                  # Clean reinit for dev environment
    taito db connect:dev                    # Access database on command line
    taito db proxy:dev                      # Start a proxy for database access
    taito db rebase:dev                     # Rebase database by redeploying all migrations
    taito db import:dev ./database/file.sql # Import a file to database
    taito db dump:dev                       # Dump database to a file
    taito db log:dev                        # Show database migration logs
    taito db revert:dev XXX                 # Revert database to change XXX
    taito db deploy:dev                     # Deploy data migrations to database
    taito db recreate:dev                   # Recreate database
    taito db diff:dev test                  # Show diff between dev and test schemas
    taito db copy between:test:dev          # Copy test database to dev

Run `taito -h` to get detailed instructions for all commands. Run `taito COMMAND -h` to show command help (e.g `taito vc -h`, `taito db -h`, `taito db import -h`). For troubleshooting run `taito --trouble`. See [PROJECT.md](PROJECT.md) for project specific conventions and documentation.

> If you run into authorization errors, authenticate with the `taito --auth:ENV` command.

> It's common that idle applications are run down to save resources on non-production environments. If your application seems to be down, you can start it by running `taito start:ENV`, or by pushing some changes to git.

### Without taito-cli

You can run this project without taito-cli, but it is not recommended as you'll lose many of the additional features that taito-cli provides.

Local development:

    npm install             # Install some libraries
    npm run install-dev     # Install some libraries
    docker-compose up       # Start containers
    npm run                 # Show all scripts that you can run with npm
    TODO: sqitch db deploy  # Requires [sqitch for postgres](http://sqitch.org/))

CI/CD:

Taito-cli supports various infrastructures and technologies out-of-the-box, and you can also extend it by writing custom plugins. But if you want to build and deploy the project without taito-cli, you'll have to write the CI scripts yourself.

## Automated tests

### Unit tests

All unit tests are run automatically during build (see the `Dockerfile.build` files). You can use any test tools that have been installed as development dependency inside the container. Test reports should be placed at the /xxx/test/reports directory. You can run unit tests manually with the `taito unit` command (see help with `taito unit -h`).

> HINT: You should not test implementation. Instead, you should test behaviour of a public API that is designed not to change very often: public API of a class, module, library or service for example. This way you can make changes to the underlying implementation, and the existing unit tests protect you from breaking anything.

> HINT: Although browser tests cannot be considered as unit tests, you can execute also them with the *unit test* mechanism. You just have to mock the required APIs so that the whole test can be run within one container.

### Integration and end-to-end tests

All integration and end-to-end test suites are run automatically after application has been deployed to dev environment. You can use any test tools that have been installed as development dependency inside the `builder` container (see `Dockerfile.build`). You can specify your environment specific test settings in `taito-config.sh` using `test_` as prefix. You can access database in your tests as database proxy is run automatically in background (see `docker-compose-test.yaml`). Test reports should be placed at the `/xxx/test/reports` directory.

Tests are grouped in test suites (see the `test-suites` files). All test suites are kept independent by cleaning up data before each test suite execution by running `taito init --clean`. If automatic data cleanup is not necessary, you can turn it off with the `ci_exec_test_init` setting in `taito-config.sh`.

You can run integration and end-to-end tests manually with the `taito test[:TARGET][:ENV] [SUITE] [TEST]` command, for example `taito test:server:dev`. When executing tests manually, the development container (`Dockerfile`) is used for executing the tests.

> Once you have implemented your first integration or e2e test, enable the CI test execution by setting `ci_exec_test=true` for dev environment.

## Structure

Project specific conventions are defined in [PROJECT.md](PROJECT.md#conventions). See the [template wiki](https://github.com/TaitoUnited/SERVER-TEMPLATE/wiki/Structure) for some tips on how to design a modular directory structure.

## Version control

Development is done in dev and feature branches.

All commit messages must be structured according to the [Conventional Commits](http://conventionalcommits.org/) convention as application version number and release notes are generated automatically for production release by the [semantic-release](https://github.com/semantic-release/semantic-release) library.

You can manage environment and feature branches using taito-cli commands. Run `taito vc -h` for instructions. If you use git commands or git GUI tools instead, remember to follow the version control conventions defined by `taito vc conventions`.

See the [template wiki](https://github.com/TaitoUnited/SERVER-TEMPLATE/wiki/Version-control) for some additional information.

## Database migrations

Add a new migration:

1. Add a new step to migration plan:

    `taito db add: NAME`, for example: `taito db add: role_enum`

2. Modify database/deploy/NAME.sql, database/revert/NAME.sql and database/verify/NAME.sql

3. Deploy the change to your local database:

    `taito db deploy`

The CI/CD tool will deploy your database changes automatically to servers once you push your changes to git. Database migrations are executed using sqitch. More instructions on sqitch: [Sqitch tutorial](https://metacpan.org/pod/sqitchtutorial)

> If any environment does not yet contain any permanent data, you can just edit the existing deploy sql files directly and run `taito init:ENV --clean` before deploying the app to the environment. However, if you delete some of the existing `deploy/*.sql` files, leave revert scripts in place. Otherwise `taito init:ENV --clean` will fail because changes cannot be reverted.

> It is recommended that you put a table name at the beginning of your migration script name. This way the table creation script and all its alteration scripts remain close to each other in the file hierarchy.

> REMINDER: Do not forget indexing. Once in a while you should review sql queries made by the application and check that essential indexes are in place in the database.

## Deployment

Deploying to different environments:

* **f-NAME**: Push to the `feature/NAME` branch.
* **dev**: Push to the `dev` branch.
* **test**: Merge changes to the `test` branch using fast-forward.
* **stag**: Merge changes to the `stag` branch using fast-forward.
* **canary**: Merge changes to the `canary` branch using fast-forward. NOTE: Canary environment uses production resources (database, storage, 3rd party services) so be careful with database migrations.
* **prod**: Merge changes to the `master` branch using fast-forward. Version number and release notes are generated automatically by the CI/CD tool.

Simple projects require only two environments: **dev** and **prod**. You can list the environments with `taito vc env list`.

You can use the `taito vc` commands to manage branches, and the `taito deployment` commands to manage builds and deployments. Run `taito vc -h` and `taito deployment -h` for instructions. Run `taito open builds` to see the build logs.

See the [template wiki](https://github.com/TaitoUnited/SERVER-TEMPLATE/wiki/Deployment) for some additional information.

> Automatic deployment might be turned off for critical environments (`ci_exec_deploy` setting in `taito-config.sh`). In such case the deployment must be run manually with the `taito -a deployment deploy:prod VERSION` command using a personal admin account after the CI/CD process has ended successfully.

## Configuration

> HINT: To save some time, start your application locally while you are configuring the project: `taito install`, `taito start`, `taito init`.

### Version control settings

The **dev** branch should be set as the default branch. Run `taito open conventions` to see organization specific conventions.

### Stack

* **Authentication:** Authentication has not yet been implemented (see [issue](https://github.com/TaitoUnited/server-template/issues/11)). Currently ingress does provide basic authentation, but it is only meant for hiding non-production environments.
* **Flow/typescript:** You can enable flow or typescript by going through parts with `NOTE: for flow` or `NOTE: for typescript` note. (TODO: implement typescript support)
* **Alternative technologies:** If you would rather use other technologies than React, Node.js and PostgreSQL, you can copy alternative example implementations from [SERVER-TEMPLATE-alt](https://github.com/TaitoUnited/SERVER-TEMPLATE-alt/).

The template supports unlimited number of (micro-)services. You can add new services like this:

1. Create a new directory for your service. Look [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) and [SERVER-TEMPLATE-alt](https://github.com/TaitoUnited/SERVER-TEMPLATE-alt/) for examples.
2. Add the service to `taito_targets` variable in `taito-config.sh`
3. Add the service to `docker-compose.yaml` and check that it works ok in local development environment.
4. Add the service to `scripts/helm.yaml`.

### Examples

The project template comes with a bunch of implementation examples. Browse the examples through, leave the ones that seem useful and remove all the rest. You can use the `taito check deps` command to prune unused dependencies. NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused by the tool. But all unused `dependencies` may usually be removed from package.json.

The client GUI uses [Material-UI](https://material-ui-next.com/) component library by default. It's a good match with the [react-admin](https://github.com/marmelab/react-admin) GUI, but please consider also other alternatives based on customer requirements. For example [Elemental](http://elemental-ui.com/) is a good alternative.

### Basic project settings

1. Modify `taito-config.sh` if you need to change some settings. The default settings are ok for most projects, but you might want to define some links with `link_urls`.
2. Run `taito project apply`
3. Commit and push changes

### Remote environments

Define remote environments with the `taito_environments` setting in `taito-config.sh`. You can create an environment by running `taito env apply:ENV`. Examples for environment names: `f-orders`, `dev`, `test`, `stag`, `canary`, `prod`.

If basic auth is used only for hiding non-production environments, you can use the same credentials for all environments. In this case you should also write them down to the [Links](#links) section so that all project personnel can easily access the credentials.

NOTE: You should remove unnecessary examples from database migrations (`./database`) and secrets (`taito-config.sh`) before creating the first server environment.

NOTE: Operations on production and staging environments usually require admin rights. Please contact DevOps personnel if necessary.

### Kubernetes

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. By modying these files you can easily configure environment variables, resource requirements and autoscaling for your containers.

You can deploy configuration changes without rebuilding with the `taito deployment deploy:ENV` command.

> Do not modify the helm template located in `./scripts/helm` directory. Improve the original helm template located in [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) repository instead.

### Secrets

1. Add a secret definition to `taito-config.sh` (taito_secrets)
2. Map secret to an environment variable in `scripts/helm.yaml`
3. Run `taito env rotate:ENV [SECRET]` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

> For local development you can just define secrets as normal environment variables in `docker-compose.yaml` given that they are not confidential.

### Upgrading to the latest version of the project template

Run `taito project upgrade`. The command copies the latest versions of reusable Helm charts, terraform templates and CI/CD scripts to your project folder, and also this README.md file. You should not make project specific modifications to them as they are designed to be reusable and easily configurable for various needs. Improve the originals instead, and then upgrade.
