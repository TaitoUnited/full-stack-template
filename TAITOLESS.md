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

    # TODO: Support for Windows without bash installed
    npm run install-dev

Set up environment variables required by `docker-compose.yaml`:

    # On unix-like shell
    . taito-config.sh

    # On Windows shell
    taitoless.bat

Setup secrets required by `docker-compose.yaml`:

> See the secret file paths at the end of `docker-compose.yaml` and set the secret file contents accordingly. Use `secret1234` as value for all 'randomly generated' secrets like database password. Other secrets values you can retrieve from dev environment with `kubectl get secrets -o yaml --namespace full-stack-template-dev`. You need to decode the base64 encoded values with the `base64` command-line tool).

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

Instructions defined in [CONFIGURATION.md](CONFIGURATION.md) apply. You just need to run commands with `npm` or `docker-compose` directly instead of Taito CLI.

If you want to setup the application environments or run CI/CD steps without Taito CLI, see the following instructions.

### Creating a remote environment

> NOTE: Add `taito-terraform-config.sh` to project root directory, if the file does not exist yet. In this file you map taito configurations into terraform TF_VAR_* variables. Terraform variable definitions can be found from `scripts/terraform/**/variables.tf`.

1) Run taito-config.sh to set the environment variables for the environment in question (usually ENV is **dev**, **test**, **uat**, **stag**, **canary**, or **prod**):
    ```
    export taito_target_env=ENV
    . taito-config.sh
    ```

2) Database is created with Taito CLI by default. Set `postgres_create_database` to `false` in **taito-project-config.sh** to create the database with Terraform instead (TODO: implement terraform). Or alternatively create the database manually, if you want to avoid saving database credentials into Terraform state:

    > MANUALLY: See the `db_*` environment variables for database definitions. Create two user accounts for the database: `FULL_STACK_TEMPLATE_ENV` for deploying the database migrations (broad user rights) and `FULL_STACK_TEMPLATE_ENV_app` for the application (concise user rights). Configure also database extensions if required by the application (see `database/db.sql`).

3) Run terraform scripts located at `scripts/terraform/${taito_provider}` (TODO: remote backend).

    > NOTE: Google Cloud scripts (gcp) assume that a google cloud project defined by `taito_resource_namespace` and `taito_resource_namespace_id` environment variables already exist.

4) Set secret values manually. Secrets are defined by `${taito_secrets}` and `${taito_remote_secrets}` environment variables, and the naming conventions is **name.property[/namespace]:method**. Use `${taito_namespace}` as namespace unless specified otherwise. Platform specific instructions:

    * **Kubernetes:** Create secrets in the correct namespace. Use **name** as secret name and **property** as data field attribute name. The secret value should be stored as base64 encoded string.
    * **AWS SSM Property Store:** Use `/${taito_zone}/namespace/name.property` as name, and `SecureString` as type. If the secret method is something else than `manual` or `random`, the value should be stored as base64 encoded string

5) Create CI/CD trigger based on the CI/CD script located on the project root directory. Use either `taitounited/taito-cli:ci-${taito_provider}` or your own custom image as docker image for the CI/CD. (TODO: implement CI/CD trigger creation with Terraform)

### Taitoless CI/CD

If you for some reason cannot use Taito CLI in your CI/CD pipeline, you can easily implement the CI/CD steps yourself. See [continuous integration and delivery](https://taitounited.github.io/taito-cli/docs/06-continuous-integration-and-delivery) chapter of Taito CLI manual for instructions.
