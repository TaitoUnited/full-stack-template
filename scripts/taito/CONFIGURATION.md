# Configuration

This file has been copied from [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/blob/dev/scripts/taito/CONFIGURATION.md) instead.

## Prerequisites

- [npm](https://github.com/npm/cli) that usually ships with [Node.js](https://nodejs.org/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Taito CLI](https://taitounited.github.io/taito-cli/) (or see [TAITOLESS.md](TAITOLESS.md))
- Optional: Some editor plugins depending on technology (e.g. [ESLint](https://eslint.org/docs/user-guide/integrations#editors) and [Prettier](https://prettier.io/docs/en/editors.html) for JavaScript/TypeScript)

## Local development environment

Start your local development environment by running `taito develop`. Once the command starts to install libraries, you can leave it on the background while you continue with configuration. Once the application has started, open the web application GUI with `taito open client`. NOTE: If your project includes a static website instead of web application GUI, you need to configure it first (see [/www/README.md](/www/README.md)), and then you can open it with `taito open www`.

> If the application fails to start, run `taito trouble` to see troubleshooting. More information on local development you can find from [DEVELOPMENT.md](DEVELOPMENT.md).

## Basic settings

1. Run `taito open conventions` in the project directory to see organization specific settings that you should configure for your git repository. At least you should set `dev` as the default branch to avoid people using master branch for development by accident.
2. Modify `scripts/taito/project.sh` if you need to change some settings. The default settings are ok for most projects.
3. Run `taito project apply`
4. Commit and push changes

- [ ] All done

## Your first remote environment (dev)

Make sure your authentication is in effect:

    taito auth:dev

Create the environment:

    taito env apply:dev

OPTIONAL: If the git repository is private, you may choose to write down the basic auth credentials to [README.md#links](../../README.md#links):

    EDIT README.md                # Edit the links section

Push some changes to dev branch with a [Conventional Commits](http://conventionalcommits.org/) commit message (e.g. `chore: configuration`):

    taito stage                   # Or just: git add .
    taito commit                  # Or just: git commit -m 'chore: configuration'
    taito push                    # Or just: git push

See it build and deploy:

    taito open builds:dev
    taito status:dev
    taito open client:dev
    taito open server:dev

> The first CI/CD run takes some time as build cache is empty. Subsequent runs should be faster.

> If CI/CD deployment fails on permissions error during the first run, the CI/CD account might not have enough permissions to deploy all the changes. In such case, execute the deployment manually with `taito deployment deploy:dev IMAGE_TAG`, and the retry the failed CI/CD build.

> If CI/CD tests fail on certificate error during the first CI/CD run, just retry the CI/CD run. Certificate manager probably had not retrieved the certificate yet.

> If you have some trouble creating an environment, you can destroy it by running `taito env destroy:dev` and then try again with `taito env apply:dev`.

- [ ] All done

## The example implementation

The project template comes with a simple example implementation. Once you don't need the examples anymore, just remove everything related to posts. You may also want to remove all configurations and libraries related to either **REST API** or **GraphQL API** if you don't need both. Note that even if you mainly use GraphQL, you still might need some REST API endpoints for handling file uploads/downloads, etc.

TIP: You can use the `taito dep check` command to prune unused dependencies from `package.json` files. NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused by the tool. But all unused `dependencies` may usually be removed from package.json.

- [ ] All done

---

## Remote environments

You can create the other environments just like you did the dev environment. However, you don't need to write down the basic auth credentials anymore, since you can reuse the same credentials as in dev environment.

Project environments are configured in `scripts/taito/project.sh` with the `taito_environments` setting. Examples for environment names: `f-orders`, `dev`, `test`, `uat`, `stag`, `canary`, `prod`.

See [remote environments](https://taitounited.github.io/taito-cli/tutorial/05-remote-environments) chapter of Taito CLI tutorial for more thorough instructions.

Operations on production and staging environments usually require admin rights. Please contact DevOps personnel if necessary.

## Helm and Terraform

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. Likewise, the `scripts/terraform.yaml` file contains default cloud settings for all environments and the `scripts/terraform-*.yaml` files contain environment specific overrides for them. By modifying these files you can easily configure environment variables, secrets, resource requirements, autoscaling, and cronjob scheduling for your containers. See `scripts/helm/examples.yaml` and `scripts/terraform/examples.yaml` for examples.

Changes you have made to containers or functions will be deployed automatically by CI/CD, but some "more permanent" terraform changes (databases, buckets, queues) you need to deploy manually with `taito env apply:ENV`.

## Secrets

You can add a new secret like this:

1. Add a secret definition to the `taito_secrets` or the `taito_remote_secrets` setting in `scripts/taito/project.sh`.
2. Map the secret definition to a secret in `docker-compose.yaml` for Docker Compose and in `scripts/helm.yaml` for Kubernetes. If you are not using Kubernetes map the secret definition in `scripts/terraform.yaml`.
3. Run `taito secret rotate:ENV SECRET` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

You can use the following methods in your secret definition:

- `random`: Randomly generated string (30 characters).
- `random-N`: Randomly generated string (N characters).
- `random-words`: Randomly generated words (6 words).
- `random-words-N`: Randomly generated words (N words).
- `random-uuid`: Randomly generated UUID.
- `manual`: Manually entered string (min 8 characters).
- `manual-N`: Manually entered string (min N characters).
- `file`: File. The file path is entered manually.
- `template-NAME`: File generated from a template by substituting environment variables and secrets values.
- `htpasswd`: htpasswd file that contains 1-N user credentials. User credentials are entered manually.
- `htpasswd-plain`: htpasswd file that contains 1-N user credentials. Passwords are stored in plain text. User credentials are entered manually.
- `csrkey`: Secret key generated for certificate signing request (CSR).

> See the [Environment variables and secrets](https://taitounited.github.io/taito-cli/tutorial/06-env-variables-and-secrets) chapter of Taito CLI tutorial for more instructions.

## Scheduled jobs

Create a cli command (see server/cli.sh) that you can execute manually on local development. Then schedule the cli command on helm.yaml:

```
  server:
    ...
    cronJobs:
      - name: examplejob
        schedule: "30 2 * * *"
        concurrencyPolicy: Forbid  # Forbid or Allow
        args:
          - ./cli.sh
          - createPost
```

If you are using serverless functions instead of Kubernetes, add command handler in server/src/function.ts, and schedule it on terraform.yaml:

```
  server:
    type: function
    ...
    cronJobs:
      - name: examplejob
        schedule: cron(30 2 * * ? *)
        command: "examplejob"
```

## Background jobs

This template comes with Redis and worker. Use them to execute jobs in background by publishing message on Redis for each job and reading those messages in your worker implementation one by one. Note that in production environment you might have multiple worker containers running simultaneously.

> If you need to execute resource intensive background jobs as fast as possible, then you should launch a separate container for each job, but there is no example for that yet.

### Server as worker

Instead of having a separate worker implementation, you can also use the server implementation as a worker by introducting MODE environment variable.

**docker-compose.yaml:**

```
  full-stack-template-worker:
    container_name: full-stack-template-worker
    build:
      context: ./server
    environment:
      MODE: worker
```

**scripts/helm.yaml:**

```
    worker:
      image: ${taito_container_registry}/server:${taito_build_image_tag}
      env:
        MODE: worker
```

Or if you are using AWS Lambda instead of Kubernetes, define worker function on **scripts/terraform.yaml** and also replace Redis with AWS SQS queue:

```
    worker:
      type: function
      image: server
      env:
        MODE: worker
      sources:
        - type: queue
          name: ${taito_project}-${taito_env}-jobs
          batchSize: 1
      awsPolicy:
        Version: '2012-10-17'
        Statement:
          # Allow jobs queue hadling
          - Effect: Allow
            Action:
              - sqs:ReceiveMessage
              - sqs:DeleteMessage
              - sqs:GetQueueAttributes
            Resource: "arn:aws:sqs:${taito_provider_region}:${taito_provider_org_id}:${taito_project}-${taito_env}-jobs"

    jobsQueue:
      type: queue
      name: ${taito_project}-${taito_env}-jobs
      visibilityTimeout: 5400 # 6x function timeout
```

## Stack

**Additional microservices:** Add a new microservice with the following steps. You can skip the IMPLEMENTATION steps if you are using a prebuilt Docker image (e.g. Redis).

1. IMPLEMENTATION OR DATABASE: Create a new directory for your service implementation or database migration scripts. Look [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/) and [alternatives](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/tree/master/alternatives) for examples.
2. IMPLEMENTATION: Add the service to `package.json` scripts: `install-all`, `lint`, `unit`, `test`, `dep-check`, `size-check`.
3. IMPLEMENTATION: Add the service to your CI/CD script (`.yml/.yaml` or `Jenkinsfile` in project root or `.github/main.workflow`).
4. OPTIONAL: In case of a database, you may want to enable the corresponding Taito CLI plugins in `scripts/taito/project.sh`. For example `postgres-db` and `sqitch-db` for PostgreSQL with Sqitch.
5. Add the service to `taito_containers`, `taito_functions`, or `taito_databases` variable in `scripts/taito/project.sh` depending on its type. If it is a database running in container, you may add it to both `taito_containers` and `taito_databases`.
6. Add required secret definitions to `taito_*secrets` variables in `scripts/taito/project.sh`, and set local secret values with `taito secret rotate: NAME`.
7. Add the service to `docker-compose*.yaml` files.
8. Add the service to `scripts/helm.yaml` for Kubernetes or to `scripts/terraform.yaml` for serverless.
9. OPTIONAL: Add the service to `docker-nginx.conf` if external access is required (e.g. with web browser).
10. Run `taito develop` and check that the service works ok in local development environment.
11. Add secret values for each remote environment with `taito secret rotate:ENV NAME`.

**Additional databases:** The template provides default configuration for a PostgreSQL database. You can add an additional databases the same way you add a microservice (described above), but you need to also add default settings for your additional database in `scripts/taito/project.sh` and environment specific overrides in `scripts/taito/env-*.sh` files. Use `db_database_*` settings of `scripts/taito/config/main.sh` as an example, and add the corresponding settings to `project.sh` and `env-*.sh` using `db_MYDATABASE_*` as environment variable naming. You may also want to add data import to your `taito-init` and `taito-init:clean` scripts in `package.json`.

**Additional storage buckets** You can add an additional storage bucket with the following steps:

1. Add the storage bucket configuration to `scripts/taito/project.sh`. For example:

   ```
   taito_buckets="... archive ..."
   st_archive_name="${taito_random_name}-archive-${taito_env}"
   ```

2. Add the storage bucket configuration to `terraform.yaml`. For example:

   ```
   archive:
     type: bucket
     name: ${st_archive_name}
     location: ${taito_default_storage_location}
     storageClass: ${taito_default_storage_class}
     cors:
       - domain: https://${taito_domain}
     # Object lifecycle
     versioning: true
     versioningRetainDays: ${taito_default_storage_days}
     # Backup (TODO: implement)
     backupRetainDays: ${taito_default_storage_backup_days}
     backupLocation: ${taito_default_storage_backup_location}
     # User rights
     admins:
       - id: serviceAccount:${taito_project}-${taito_env}-server@${taito_resource_namespace_id}.iam.gserviceaccount.com
     objectAdmins:
     objectViewers:
   ```

3. Add the storage bucket to `storage/` and `storage/.minio.sys/buckets/`.
4. Add the storage bucket environment variables in `docker-compose.yaml` and `helm.yaml`.
5. Add the storage bucket to implementation (e.g. configuration in `config.ts` and `storage.ts`, uptime check in `InfraRouter.ts`)
6. Start you local development environment with `taito start`.
7. Check that the bucket works ok by running the uptime check with `taito open server`.
8. Create the storage bucket for remote environments with `taito env apply:ENV`. You most likely need to run only the terraform step.

**Static site generator (www):** See [/www/README.md](/www/README.md) for configuration instructions. You can use static site generator e.g. for user guides, API documentation, or application website.

**Custom deployment:** If you cannot use Docker containers on your remote environments, you can customize the deployment. Instead of deploying the application as docker container images, you can, for example, deploy the application as WAR or EAR packages on a Java application server, or install everything directly on the remote host. You can enable the custom provider by setting `taito_provider=custom` (TODO: use taito_deployment_platforms instead) in `scripts/taito/config/main.sh` and by implementing [custom deployment scripts](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/blob/master/scripts/taito/deploy-custom) yourself.

**Environment descriptions in a separate repository**: Execute the following steps, if you want to keep your environment descriptions (`scripts/` and `database/`) in an another git repository:

1. Move `scripts/`, `database/` and `taito-config.sh` to the another repository.

2. Move `db-deploy`, `deployment-deploy`, `deployment-wait`, `test`, and `deployment-verify` CI/CD steps to the another repository.

3. OPTIONAL: As a last step of your CI/CD script, trigger deployment of the another repository by setting image tag value (COMMIT_SHA) either to the CI/CD script or helm.yaml of the another repository.

4. Add a new `taito-config.sh` to the project root dir that refers to the scripts located on the another repository:

   ```
   # Mount `scripts/` and `database/` from environment repository
   taito_mounts="
     ~/projects/my-project-env/database:/project/database
     ~/projects/my-project-env/scripts:/project/scripts
   "

   # Read Taito CLI configurations from the environment repository
   if [[ -f scripts/taito/config/main.sh ]]; then
     . scripts/taito/config/main.sh
   fi
   ```

## Automated tests

### Unit tests

All unit tests are run automatically during build (see the `Dockerfile.build` files). You can use any test tools that have been installed as development dependency inside the container. If the test tools generate reports, they should be placed at the `/service/test/reports` (`./test/reports`) directory inside the container. You can run unit tests manually with the `taito unit` command (see help with `taito unit -h`).

### Integration and end-to-end tests

All integration and end-to-end test suites are run automatically after application has been deployed to dev environment. You can use any test tools that have been installed as development dependency inside the `builder` container (see `Dockerfile.build`). You can specify your environment specific test settings in `scripts/taito/testing.sh` using `test_` as prefix. You can access database in your tests as database proxy is run automatically in background (see `docker-compose-cicd.yaml`). If the test tools generate reports, screenshots or videos, they should be placed at the `/service/test/reports`, `/service/test/screenshots` and `/service/test/videos` directories.

Tests are grouped in test suites (see the `test-suites` files). All test suites can be kept independent by cleaning up data before each test suite execution by running `taito init --clean`. You can enable data cleaning in `scripts/taito/testing.sh` with the `ci_exec_test_init` setting, but you should use it for dev environment only.

You can run integration and end-to-end tests manually with the `taito test[:TARGET][:ENV] [SUITE] [TEST]` command, for example `taito test:server:dev`. When executing tests manually, the development container (`Dockerfile`) is used for executing the tests.
