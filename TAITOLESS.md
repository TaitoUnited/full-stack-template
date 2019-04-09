# Without Taito CLI

This file has been copied from [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/SERVER-TEMPLATE/blob/dev/TAITOLESS.md) instead. Project specific conventions are located in [README.md](README.md#conventions).

> TODO: Improve instructions

Table of contents:

* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Testing](#testing)
* [Configuration](##onfiguration)

## Prerequisites

* [Node.js](https://nodejs.org/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* PostgreSQL client
* Optional: eslint/tslint and prettier plugins for your code editor

## Quick start

Install some libraries on host:

    npm install
    npm run install-dev

Setup local secrets:

    TODO

Start containers:

    docker-compose up

Run database migrations with sqitch and import init data:

    npm run sqitch
    TODO import database/data/local.sql

Open the application on browser:

    http://localhost:9999

Open admin GUI in browser:

    http://localhost:9999/admin

Open server API in browser:

    http://localhost:9999/api/healthz

Open www site in browser:

    http://localhost:7463/docs

Connect to database:

    TODO

Use `npm`, `docker-compose` and `docker` normally to run commands and operate containers.

## Testing

You may run Cypress against any remote environment without Taito CLI or docker. See `client/test/README.md` for more instructions.

## Configuration

Instructions defined in [CONFIGURATION.md](CONFIGURATION.md) apply. You just need to run commands with `npm` or `docker-compose` directly instead of Taito CLI. If you want to setup the application environments or run CI/CD steps without Taito CLI, see the following instructions.

## Creating an environment

* TODO: run taito-config.sh to set environment variables
* Optional: If your application requires some application specific external resources like storage buckets, run terraform scripts are located at `scripts/terraform/`. Note that the scripts assume that a cloud provider project defined by `taito_resource_namespace` and `taito_resource_namespace_id` already exists and Terraform is allowed to create resources for that project.
* Create a relational database (or databases) for an environment e.g. by using cloud provider web UI. See `db_*` settings in `taito-config.sh` for database definitions. Create two user accounts for the database: `SERVER_TEMPLATE_ENV` for deploying the database migrations (broad user rights) and `SERVER_TEMPLATE_ENV_app` for the application (concise user rights). Configure also database extensions if required by the application (see `database/db.sql`).
* Set Kubernetes secret values with `kubectl`. The secrets are defined by `taito_secrets` in `taito-config.sh`, and they are referenced in `scripts/helm*.yaml` files.

## Deploying the application (CI/CD)

> TODO: support `taito project eject` that will eject minimal set of scripts to project directory so that CI/CD continues to work even without taito-cli.

* Build all container images with [Docker](https://www.docker.com/) and push them to a Docker image registry.
* Deploy database migrations with [Sqitch](http://sqitch.org/). Sqitch scripts are located in `database/`.
* Deploy application to Kubernetes with [Helm](https://helm.sh/). Helm templates are located in `scripts/helm/` and environment specific values are located in `scripts/helm*.yaml`. Note that Helm does not support environment variables in value yaml files (this feature is implemented in the Taito CLI Helm plugin). Therefore you need to create a separate `scripts/heml-ENV.yaml` file for each environment and use hardcoded values in each.
* Optional: Run automatic integration and e2e tests
* Optional: Revert migrations and deployment if some of the tests fail.
* Optional: Generate documentation and other artifacts, and publish them
* Optional: Make a production release with semantic-release (see `package.json`)
