# Taitoless: without Taito CLI

This file has been copied from [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/blob/dev/scripts/taito/TAITOLESS.md) instead. Project specific conventions are located in [README.md](../../README.md#conventions).

Table of contents:

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Testing](#testing)
- [Configuration](##onfiguration)

## Prerequisites

- [Node.js (LTS version)](https://nodejs.org/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [PostgreSQL client](https://wiki.postgresql.org/wiki/PostgreSQL_Clients)
- [Sqitch](https://sqitch.org/)
- Some editor plugins depending on technology (e.g. [ESLint](https://eslint.org/docs/user-guide/integrations#editors) and [Prettier](https://prettier.io/docs/en/editors.html) for JavaScript/TypeScript)

## Quick start

Install mandatory libraries on host:

    npm install

Install additional libraries on host for autocompletion/linting on editor (optional):

    npm run install-dev

Set up environment variables required by `docker-compose.yaml`:

    . ./taito-config.sh

Setup secrets required by `docker-compose.yaml`:

> See the secret file paths at the end of `docker-compose.yaml` and set the secret file contents accordingly. Use `secret1234` as value for all 'randomly generated' secrets like database password. Ask other secret values from you colleagues or just retrieve them from dev environment with `kubectl get secrets -o yaml --namespace full-stack-template-dev`. You need to decode the base64 encoded values with the `base64` command-line tool).

Start containers defined in `docker-compose.yaml`:

    docker compose up

Deploy database migrations with Sqitch:

    . ./taito-config.sh   # Set environment variables, if not already set for this shell
    (cd database; SQITCH_PASSWORD=secret1234 sqitch -h localhost -p 6000 -d $db_database_name -u $db_database_app_username deploy)

Import development data to database:

    . ./taito-config.sh   # Set environment variables, if not already set for this shell
    PGPASSWORD=secret1234 psql -h localhost -p 6000 -d $db_database_name -U $db_database_app_username -f database/data/local.sql

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

**OUT OF DATE:** You may run Playwright against any remote environment without Taito CLI or docker. See `client/test/README.md` for more instructions.

## Configuration

Instructions defined in [CONFIGURATION.md](CONFIGURATION.md) apply. You just need to run commands with `npm` or `docker-compose` directly instead of Taito CLI.

If you want to setup the application environments or run CI/CD steps without Taito CLI, see the following instructions.

### Creating a remote environment

> TIP: The template uses Taito CLI for managing databases and secrets instead of Terraform. If you don't want to set them up manually, you can add database and secrets to your Terraform scripts (TODO: example). But be aware that Terraform stores all data in state as plain-text: https://www.terraform.io/docs/state/sensitive-data.html

1. **Create database(s):** Create database with name _full-stack-template_ENV_ and grant access to two user accounts: _full-stack-template_ENV_ for deploying the database migrations (broad rights), and _full-stack-template_ENV_app_ for the application (concise rights). Configure also database extensions if required by the application (see `database/db.sql`). You can see additional database information with:

   ```
   # Export environment variables (ENV = dev, test, uat, stag, or prod)
   export taito_target_env=ENV
   . taito-config.sh

   # Show database variables
   env | grep ^db_
   ```

2. **Set secret values:** Secrets are defined by `${taito_secrets}` and `${taito_remote_secrets}` environment variables, and the naming conventions is **name.property[/namespace]:method**. Use `${taito_namespace}` as namespace unless specified otherwise. Platform specific instructions:

   - **Kubernetes:** Create secrets in the correct namespace. Use **name** as secret name and **property** as data field attribute name. The secret value should be stored as base64 encoded string.
   - **AWS SSM Property Store:** Use `/${taito_zone}/namespace/name.property` as name, and `SecureString` as type. If the secret method is something else than `manual` or `random`, the value should be stored as base64 encoded string

   ```
   # Export environment variables (ENV = dev, test, uat, stag, or prod)
   export taito_target_env=ENV
   . taito-config.sh

   # Show secret variables
   echo $taito_secrets | tr ' ' '\n'
   echo $taito_remote_secrets | tr ' ' '\n'
   ```

3. **Create and run CI/CD trigger:** CI/CD script is located on the project root directory. Use either `ghcr.io/taitounited/taito-cli:ci-${taito_provider}` or your own custom image as docker image for the CI/CD.

4. **Optional:** If your project requires additional cloud resources set by terraform (e.g. storage buckets), run the terraform scripts:

   > NOTE: Copy `scripts/taito/examples/terraform.sh` to project root directory, if the file does not exist yet, and set environment variables required by terraform scripts.

   > NOTE: Azure scripts assume that a resource group defined by `taito_resource_namespace_id` environment variable already exists, since it is usually shared among multiple taito projects.

   > NOTE: Google Cloud (gcp) scripts assume that a google cloud project defined by `taito_resource_namespace` and `taito_resource_namespace_id` environment variables already exists, since it is usually shared among multiple taito projects.

   ```
   # Export environment variables (ENV = dev, test, uat, stag, or prod)
   export taito_target_env=ENV
   . taito-config.sh

   # Create a merged yaml file that includes all the values for the environment
   # without any environment variables and delete the unmerged yaml files.
   nano scripts/terraform/terraform-${taito_target_env}-merged.yaml

   # Create basic resources (e.g. storage buckets)
   cd scripts/terraform/${taito_provider}
   envsubst < templates/backend.tfvars > ${env}/backend.tfvars
   terraform init -reconfigure -backend-config=${env}/backend.tfvars
   terraform apply -state=${env}/terraform.tfstate

   # Serverless AWS only: Create deployment (e.g. api gateway and functions)
   cd scripts/terraform/${taito_provider}-deploy
   envsubst < templates/backend.tfvars > ${env}/backend.tfvars
   terraform init -reconfigure -backend-config=${env}/backend.tfvars
   terraform apply -state=${env}/terraform.tfstate

   # Set uptime monitoring
   cd scripts/terraform/${taito_uptime_provider}
   envsubst < templates/backend.tfvars > ${env}/backend.tfvars
   terraform init -reconfigure -backend-config=${env}/backend.tfvars
   terraform apply -state=${env}/terraform.tfstate
   ```

   NOTE: After environment has been created, you can deploy changes to it by running appropriate terraform command: `terraform apply -state=$ENV/terraform.tfstate`

### Taitoless CI/CD

If you for some reason cannot use Taito CLI in your CI/CD pipeline, you can easily implement the CI/CD steps yourself. See [continuous integration and delivery](https://taitounited.github.io/taito-cli/docs/06-continuous-integration-and-delivery) chapter of Taito CLI manual for instructions.
