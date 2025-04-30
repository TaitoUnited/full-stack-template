# Alternative stack components

Templates for alternative stack components can be found under `/alternatives`.

## Client

### Static

Serve static files with nginx.

### Vue

<!-- TODO -->

## Server

### Django + uwsgi

#### Pip packages

Pip packages are managed with pip-tools by running `pip-compile requirements-[dev/prod].in` which outputs `requirements-[dev/prod].txt` with specific package versions including dependencies.

- requirements.in
  - Common packages for dev and prod.
  - Contains `python-json-logger` for logging.
- requirements-dev.in
  - Packages for local environment: flake8, mypy, pytest...
- requirements-prod.in
  - Packages for non-local environment: stackdriver, uwsgi...

NOTE that some script is required to run the `pip-compile` inside the server container to ensure correct python and pip versions.

### Flask

<!-- TODO -->

### Laravel

<!--- TODO: Implement the same way as server-symfony: -->

- Replace symfony specific stuff on Dockerfile and docker/php with laravel specific stuff.
- Run migrations on package.json with `php artisan migrate` instead of `bin/console doctrine:migrations:migrate --no-interaction`.

### Micronaut (java, reactive)

<!--- TODO: Reactive Micronaut example. Use Kotlin? -->

#### Autorestart

You can turn autorestart on/off in `src/main/resources/application.yml`. Note that you can manually restart the server at anytime with `taito restart:server`.

### Remix.js template (with Drizzle ORM)

#### Remix.js app

1. Create remix.js app by executing `npx create-remix@latest server` in the root directory of your project. Select **npm** as the dependency installer.
2. Add `unit` script on **server/package.json**: `"unit": "echo 'no unit tests yet'",`.
3. Change path `/api` into `/` in the following files:
   - **docker-nginx.conf**
   - **scripts/helm.yaml**
   - **scripts/terraform.yaml**
4. Tune taito_links in **scripts/taito/project.sh** (`taito open server` should open `/` instead of `/api/uptimez`)

#### Drizzle ORM

If you would like to use Drizzle ORM instead of plain SQL and Sqitch, execute the following steps:

1. Install Drizzle ORM for PostgreSQL in **server** directory with npm.
2. Set up Drizzle ORM so that it reads database connection details from `DATABASE_*` environment variables.
3. Add db-migrate script on `server/package.json` for running database migrations, for example: `"db-migrate": "ts-node src/db/migrate.ts"`
4. Disable Sqitch Taito CLI plugin by removing `sqitch-db` from **scripts/taito/project.sh**.
5. Enable Drizzle ORM migrations for Taito CLI and CI/CD by adding the following script on the package.json file located on project root:

```sh
"taito-host-db-deploy": "if [ ${taito_env} = 'local' ]; then docker exec ${taito_project}-server npx ts-node src/db/migrate.ts; else docker compose -f docker-compose-cicd.yaml run --rm ${taito_project}-server-cicd sh -c 'echo Sleeping... && sleep 30 && echo Done sleeping && npm run db-migrate'; fi",
"taito-host-db-revert": "echo 'db revert not implemented'; exit 1;",
"taito-host-db-rebase": "echo 'db rebase not implemented'; exit 1;",
```

> TIP: Even though you are no longer using Sqitch for database migrations, you can still define database extensions in `database/db.sql` and test data for different environments in `database/data/`. The data defined in `database/data/local.sql` will be deployed automatically to local database on `taito develop` and `taito init [--clean]`.

### Symfony

This template is work in progress. At least the following need to be configured manually:

1. Add nginx as server sidecar:

On docker-nginx.conf:

```nginx
  location /api {
      client_max_body_size 1m;
      proxy_pass http://full-stack-template-nginx:8080;
      ...
      ...
  }
```

On docker-compose.yaml:

```yaml
  full-stack-template-server:
    container_name: full-stack-template-server
    build:
      context: ./server
      dockerfile: ${dockerfile}
      target: builder
  ...
  full-stack-template-nginx:
    container_name: full-stack-template-nginx
    build:
      context: ./server
      dockerfile: ${dockerfile}
      target: nginx
    restart: unless-stopped
    volumes:
      - php_socket:/var/run/php
    networks:
      - default
    ports:
      - "8080"
```

On helm.yaml:

```yaml
  server:
    ... no path here ...
    livenessCommand:
      - docker-healthcheck
    sidecar:
      enabled: true
      name: nginx
      image: ${taito_container_registry}/nginx:${taito_build_image_tag}
      paths:
      - path: /api
      cpuRequest: 10m
      memoryRequest: 10Mi
      sharedVolume:
        mountPath: /var/run/php
        sidecarMountPath: /var/run/php
```

2. Build both nginx and server image on CI/CD. Example for cloudbuild.yaml:

On project.sh:

```sh
taito_containers=" ... nginx server ... "
```

On cloudbuild.yaml:

```yaml
  - id: artifact-prepare-nginx
    waitFor: ["build-prepare"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args:
      [
        "artifact-prepare:nginx:$BRANCH_NAME",
        "$COMMIT_SHA",
        "nginx",
        "false",
        "./server",
        "./server",
        "Dockerfile",
      ]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}

  - id: artifact-prepare-server
    waitFor: ["build-prepare"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args: ["artifact-prepare:server:$BRANCH_NAME", "$COMMIT_SHA", "php"]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}

  ...
  ...

  - id: artifact-release-nginx
    waitFor: ["deployment-verify"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args: ["artifact-release:nginx:$BRANCH_NAME", "$COMMIT_SHA"]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}

  - id: artifact-release-server
    waitFor: ["deployment-verify"]
    name: "ghcr.io/taitounited/taito-cli:ci-gcp-dev"
    args: ["artifact-release:server:$BRANCH_NAME", "$COMMIT_SHA"]
    env:
      - taito_mode=ci
      - taito_ci_phases=${_TAITO_CI_PHASES}
```

3. Configure database migrations for Taito CLI:

On root package.json:

```json
"taito-host-init": "taito -z ${taito_options} init:${taito_env} && npm run taito-host-db-deploy && npm-run-all import-db-data generate",
"taito-host-init:clean": "taito -z ${taito_options} init:${taito_env} --clean && npm run taito-host-db-deploy && npm-run-all import-db-data clean:storage generate",
"taito-host-db-deploy": "if [ ${taito_env} = 'local' ]; then docker exec ${taito_project}-server bin/console doctrine:migrations:migrate --no-interaction; else docker compose -f docker-compose-cicd.yaml run --rm ${taito_project}-server-cicd sh -c 'echo Sleeping... && sleep 30 && echo Done sleeping && bin/console doctrine:migrations:migrate --no-interaction'; fi",
```

### full-stack-template | server (old)

Found under `alternatives/server-old`.

Structure recommendations:

#### Layers

Responsibilities:

- Resolvers: Map GraphQL requests into service calls.
- Routers: Map REST requests into service calls.
- Services: Provide use case specific business logic.
- DAOs or Repositories: Provide reusable logic for data access and persistence.

NOTE: This template uses DAO pattern by default to give you all the power of PostgreSQL and to avoid monolithicness of a ORM model. However, do not misuse it by implementing bloated DAOs. Implement reusable DAO logic and keep use case specific logic in services, if it's possible.

#### Modular implementation vs microservices

Instead of implementing small microservices from the day one, divide your implementation into 1-N fairly independent modules and place common logic in **common** folder. See the **core** module and the **common** folder as an example. This makes refactoring module boundaries and responsibilities easier at the beginning, but enables you to split the implementation into small microservices later, if such need arises. And of course, a really small server implementation typically consists of just one module (e.g. **core** module).

Use any folder structure you see fit inside your modules. The **core** module presents one example that is based on layers: resolvers -> services -> daos. If your module is very small, you may not need subfolders at all.

#### Circular dependencies and event-based messaging

You should avoid circular dependencies between your modules. If you can't break a circular dependency by moving code to another module, you can try to use event-based messaging library instead (think of observer and publish/subscribe patterns). Event-based messaging also helps you to keep your modules more loosely coupled, which might improve maintainability in the long run.

EXAMPLE: When a new product is created by a **catalog** module, it publishes a _product created_ event. A **warehouse** module has subscribed to _product created_ events, and it adds product details required by the warehouse functionality to its own database tables when a product has been created.

#### Splitting into microservices

Often there is no need to split a modular monolithic implementation into microservices. But if you choose to do so, one of the microservices should act as a GraphQL Gateway (see [Apollo Federation](https://www.apollographql.com/docs/federation/)). You should also replace the messaging library with some message broker (e.g. Redis, RabbitMQ, or Kafka). Note that when split into microservices, you cannot rely solely on transactions anymore. You may need additional fault tolerance mechanisms like dead letter queues, circuit breakers, etc. based on your business requirements.
