# Development

This file has been copied from [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/SERVER-TEMPLATE/blob/dev/DEVELOPMENT.md) instead. Project specific conventions are located in [README.md](README.md#conventions). See the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for more thorough development instructions. Note that Taito CLI is optional (see [without Taito CLI](#without-taito-cli)).

Table of contents:

* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Code structure](#code-structure)
* [Version control](#version-control)
* [Database migrations](#database-migrations)
* [Deployment](#deployment)
* [Usage without Taito CLI](#usage-without-taito-cli)
* [Upgrading](#upgrading)
* [Configuration](#configuration)

## Prerequisites

* [Node.js](https://nodejs.org/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* Optional: [Taito CLI](https://github.com/TaitoUnited/taito-cli#readme)
* Optional: eslint and prettier plugins for your code editor

## Quick start

Install linters and some libraries on host for code autocompletion purposes (add `--clean` to make a clean reinstall):

    taito install

Start containers (add `--clean` to make a clean rebuild, and to discard all data and db tables):

    taito start

Make sure that everything has been initialized (e.g database) (add `--clean` to make a clean reinit):

    taito init

Open client GUI in browser:

    taito open client

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

Check code quality:

    taito check code
    taito check code:admin
    taito check code:client
    taito check code:server

Check build size:

    taito check size
    taito check size:client

Check dependencies (available updates, vulnerabilities):

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
    taito open client:dev                   # Open client GUI in browser
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

Run `taito -h` to get detailed instructions for all commands. Run `taito COMMAND -h` to show command help (e.g `taito db -h`, `taito db import -h`). For troubleshooting run `taito --trouble`. See [README.md](README.md) for project specific conventions and documentation.

> If you run into authorization errors, authenticate with the `taito --auth:ENV` command.

> It's common that idle applications are run down to save resources on non-production environments. If your application seems to be down, you can start it by running `taito start:ENV`, or by pushing some changes to git.

## Code structure

Project specific conventions are defined in [README.md](README.md#conventions). See [software design](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/b-software-design.md) appendix of the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for some tips on how to design a modular directory structure.

## Version control

Development is done in `dev` and `feature/*` branches. Hotfixes are done in `hotfix/*` branches. You should not commit changes to any other branch.

All commit messages must be structured according to the [Angular git commit convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) (see also [Conventional Commits](http://conventionalcommits.org/)). This is because application version number and release notes are generated automatically for production release by the [semantic-release](https://github.com/semantic-release/semantic-release) library.

> You can also use `wip` type for such feature branch commits that will be squashed during rebase.

You can manage environment and feature branches using Taito CLI commands. Run `taito env -h`, `taito feat -h`, and `taito hotfix -h` for instructions. If you use git commands or git GUI tools instead, remember to follow the version control conventions defined by `taito conventions`. See [version control](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/03-version-control.md) chapter of the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for some additional information.

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

Simple projects require only two environments: **dev** and **prod**. You can list the environments with `taito env list`.

You can use the taito commands to manage branches, builds, and deployments. Run `taito env -h`, `taito feat -h`, `taito hotfix -h`, and `taito deployment -h` for instructions. Run `taito open builds` to see the build logs. See [version control](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/03-version-control.md) chapter of the [Taito CLI tutorial](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/README.md) for some additional information.

> Automatic deployment might be turned off for critical environments (`ci_exec_deploy` setting in `taito-config.sh`). In such case the deployment must be run manually with the `taito -a deployment deploy:prod VERSION` command using a personal admin account after the CI/CD process has ended successfully.

## Usage without Taito CLI

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

## Upgrading

Run `taito project upgrade`. The command copies the latest versions of reusable Helm charts, terraform templates and CI/CD scripts to your project folder, and also this README.md file. You should not make project specific modifications to them as they are designed to be reusable and easily configurable for various needs. Improve the originals instead, and then upgrade.

## Configuration

See [CONFIGURATION.md](CONFIGURATION.md).
