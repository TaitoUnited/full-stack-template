# Without Taito CLI

This file has been copied from [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/blob/dev/TAITOLESS.md) instead. Project specific conventions are located in [README.md](README.md#conventions).

Table of contents:

* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Testing](#testing)
* [Configuration](##onfiguration)

## Prerequisites

* [npm](https://github.com/npm/cli) that usually ships with [Node.js](https://nodejs.org/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [PostgreSQL client](https://wiki.postgresql.org/wiki/PostgreSQL_Clients)
* [Sqitch](https://sqitch.org/)
* Optional: Some editor plugins depending on technology (e.g. [ESLint](https://eslint.org/docs/user-guide/integrations#editors) and [Prettier](https://prettier.io/docs/en/editors.html) for JavaScript/TypeScript)

## Quick start

Install mandatory libraries on host:

    npm install

Install additional libraries on host for autocompletion/linting on editor (optional):

    # TODO: Support for Windows without bash
    npm run install-dev

Set up environment variables required by `docker-compose.yaml`:

    # On unix-like shell
    . taitoless.sh

    # On Windows shell
    taitoless.bat

Setup secrets required by `docker-compose.yaml`:

> See the secret file paths at the end of `docker-compose.yaml` and set the secret file contents accordingly.

Start containers defined in `docker-compose.yaml`:

    docker-compose up

Deploy database migrations with Sqitch:

    sqitch -h localhost -p 6000 -d $db_database_name -u $db_database_app_username -f database/sqitch.plan deploy

Import development data to database:

    psql -h localhost -p 6000 -d $db_database_name -U $db_database_app_username -f database/data/local.sql

Open the application on browser:

    http://localhost:9999

Open admin GUI in browser:

    http://localhost:9999/admin

Open server API in browser:

    http://localhost:9999/api/healthz

Open www site in browser:

    http://localhost:7463/docs

Connect to database using password `secret1234`:

    psql -h localhost -p 6000 -d $db_database_name -U $db_database_app_username

Use `npm`, `docker-compose` and `docker` normally to run commands and operate containers.

If you would like to use some of the additional commands provided by Taito CLI also without using Taito CLI, first run the command with verbose option (`taito -v`) to see which commands Taito CLI executes under the hood, and then implement them in your `package.json` or `Makefile`.

## Testing

You may run Cypress against any remote environment without Taito CLI or docker. See `client/test/README.md` for more instructions.

## Configuration

Instructions defined in [CONFIGURATION.md](CONFIGURATION.md) apply. You just need to run commands with `npm` or `docker-compose` directly instead of Taito CLI. If you want to setup the application environments or run CI/CD steps without Taito CLI, see the following instructions.

### Creating an environment

* Run taito-config.sh to set the environment variables for the environment in question (dev, test, stag, canary, or prod):
    ```
    set -a
    taito_target_env=dev
    . taito-config.sh
    set +a
    ```
* Run terraform scripts that are located at `scripts/terraform/`. Use `scripts/terraform/common/backend.tf` as backend, if you want to store terraform state on git. Note that the terraform scripts assume that a cloud provider project defined by `taito_resource_namespace` and `taito_resource_namespace_id` already exists and Terraform is allowed to create resources for that project.
* (TODO: create database with terraform instead): Create a relational database (or databases) for an environment e.g. by using cloud provider web UI. See `db_*` settings in `taito-config.sh` for database definitions. Create two user accounts for the database: `FULL_STACK_TEMPLATE_ENV` for deploying the database migrations (broad user rights) and `FULL_STACK_TEMPLATE_ENV_app` for the application (concise user rights). Configure also database extensions if required by the application (see `database/db.sql`).
* Set Kubernetes secret values with `kubectl`. The secrets are defined by `taito_secrets` in `taito-config.sh`, and they are referenced in `scripts/helm*.yaml` files.

### Setting up CI/CD

You can easily implement CI/CD steps without Taito CLI. See [continuous integration and delivery](https://taitounited.github.io/taito-cli/docs/06-continuous-integration-and-delivery) chapter of Taito CLI manual for instructions.
