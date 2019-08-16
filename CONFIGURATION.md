# Configuration

This file has been copied from [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/blob/dev/CONFIGURATION.md) instead.

## Prerequisites

* [npm](https://github.com/npm/cli) that usually ships with [Node.js](https://nodejs.org/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Taito CLI](https://taitounited.github.io/taito-cli/) (or see [TAITOLESS.md](TAITOLESS.md))
* Optional: Some editor plugins depending on technology (e.g. [ESLint](https://eslint.org/docs/user-guide/integrations#editors) and [Prettier](https://prettier.io/docs/en/editors.html) for JavaScript/TypeScript)

## Local development environment

Start your local development environment by running `taito kaboom`. Once the command starts to install libraries, you can leave it on the background while you continue with configuration. Once the application has started, open the web gui with `taito open client`. If the application fails to start, run `taito trouble` to see troubleshooting. More information on local development you can find from [DEVELOPMENT.md](DEVELOPMENT.md).

## Basic settings

1. Run `taito open conventions` in the project directory to see organization specific settings that you should configure for your git repository. At least you should set `dev` as the default branch to avoid people using master branch for development by accident.
2. Modify `taito-project-config.sh` if you need to change some settings. The default settings are ok for most projects.
3. Run `taito project apply`
4. Commit and push changes

* [ ] All done

## Your first remote environment (dev)

Make sure your authentication is in effect:

    taito auth:dev

Create the environment:

    taito env apply:dev

Write down the basic auth credentials to [README.md#links](README.md#links):

    EDIT README.md                # Edit the links section

Write down the basic auth credentials to `taito-testing-config.sh`:

    EDIT taito-testing-config.sh  # Edit this: ci_test_base_url=https://username:secretpassword@...

Push some changes to dev branch with a [Conventional Commits](http://conventionalcommits.org/) commit message (e.g. `chore: configuration`):

    taito stage                   # Or just: git add .
    taito commit                  # Or just: git commit -m 'chore: configuration'
    taito push                    # Or just: git push

See it build and deploy:

    taito open builds:dev
    taito status:dev
    taito open client:dev
    taito open server:dev

> If CI/CD tests fail on certificate error during the first CI/CD run, just retry the CI/CD run. Certificate manager probably had not retrieved the certificate yet.

> If you have some trouble creating an environment, you can destroy it by running `taito env destroy:dev` and then try again with `taito env apply:dev`.

* [ ] All done

## Blog example

The project template comes with a blog implementation that includes examples for web user interface, REST, GraphQL, database, files, background jobs, real-time notifications, pdf printing, etc. Once you don't need the examples anymore, just remove everything related to `blog` and use the `taito check deps` command to prune unused dependencies from `package.json` files. NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused by the tool. But all unused `dependencies` may usually be removed from package.json.

The client GUI uses [Material-UI](https://material-ui-next.com/) component library by default. It's a good match with the [react-admin](https://github.com/marmelab/react-admin) GUI, but please consider also other alternatives based on customer requirements. For example [Semantic UI React](https://react.semantic-ui.com/) and [Elemental](http://elemental-ui.com/) are also good alternatives.

* [ ] All done

---

## Remote environments

You can create the other environments just like you did the dev environment. However, you don't need to write down the basic auth credentials anymore, since you can reuse the same credentials as in dev environment.

Project environments are configured in `taito-project-config.sh` with the `taito_environments` setting. Examples for environment names: `f-orders`, `dev`, `test`, `stag`, `canary`, `prod`.

See [remote environments](https://taitounited.github.io/taito-cli/tutorial/05-remote-environments) chapter of Taito CLI tutorial for more thorough instructions.

Operations on production and staging environments usually require admin rights. Please contact DevOps personnel if necessary.

## Stack

**Minikube:** If you would rather use minikube for local development instead of docker-compose, remove `docker-compose:local` plugin, and the `:-local` restriction from `kubectl:-local` and `helm:-local` plugins. These are configured with the `taito_plugins` setting in `taito-config.sh`. Note that you can also permanently define your preference in your personal or organizational taito-config.sh to avoid manual change every time you create a new project, for example: `template_default_engine_local="minikube"`. (TODO: Not tested on minikube yet. Probably needs some additional work.).

**Additional microservices:** You can use either monorepo or multirepo approach with this template. If you are going for multirepo, just create a separate project for each microservice. If you want some of them to share the same namespace, define common `taito_namespace` in taito-config.sh. If you are going for monorepo, or something in between multirepo and monorepo approaches, you can add a new microservice to a repository like this:

  1. Create a new directory for your service. Look [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/) and [alternatives](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/tree/master/alternatives) for examples.
  2. Add the service to `taito_targets` variable in `taito-project-config.sh`
  3. Add the service to `docker-compose*.yaml` files and check that it works ok in local development environment.
  4. Add the service to `scripts/helm.yaml`.
  5. Add the service to `package.json` scripts: `install-all`, `lint`, `unit`, `test`, `check-deps`, `check-size`.
  6. Add the service to your CI/CD script (`.yml/.yaml` or `Jenkinsfile` in project root or `.github/main.workflow`).

**Kafka:** TODO: Kafka for event-driven microservices.

**API gateway:** TODO: nginx-ingress by default.

**Istio:** TODO: Istio service mesh.

**Authentication:** Ingress provides basic authentication, but it is only meant for hiding non-production environments. Here are some good technologies for implementing authentication: [Auth0](https://auth0.com), [Passport](http://www.passportjs.org/), [ORY Oathkeeper](https://www.ory.sh/api-access-control-kubernetes-cloud-native).

**Static site generator (www):** See [www/README.md](www/README.md) for configuration instructions. You can use static site generator e.g. for user guides or API documentation.

**Custom provider:** If you cannot use Docker containers on your remote environments, you can customize the deployment with a custom provider. Instead of deploying the application as docker container images, you can, for example, deploy the application as WAR or EAR packages on a Java application server, or install everything directly on the remote host. You can enable the custom provider by setting `taito_provider=custom` in `taito-config.sh` and by implementing [custom deployment scripts](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/blob/master/scripts/custom-provider) yourself.

## Kubernetes

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. By modifying these files you can easily configure environment variables, resource requirements and autoscaling for your containers.

You can deploy configuration changes without rebuilding with the `taito deployment deploy:ENV` command.

> Do not modify the helm template located in `./scripts/helm` directory. Improve the original helm template located in [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/) repository instead.

## Secrets

You can add a new secret like this:

1. Add a secret definition to the `taito_secrets` or the `taito_remote_secrets` setting in `taito-project-config.sh`.
2. Map the secret definition to a secret in `docker-compose.yaml` for Docker Compose and in `scripts/helm.yaml` for Kubernetes.
3. Run `taito env rotate:ENV SECRET` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

## Automated tests

### Unit tests

All unit tests are run automatically during build (see the `Dockerfile.build` files). You can use any test tools that have been installed as development dependency inside the container. If the test tools generate reports, they should be placed at the `/service/test/reports` (`./test/reports`) directory inside the container. You can run unit tests manually with the `taito unit` command (see help with `taito unit -h`).

### Integration and end-to-end tests

All integration and end-to-end test suites are run automatically after application has been deployed to dev environment. You can use any test tools that have been installed as development dependency inside the `builder` container (see `Dockerfile.build`). You can specify your environment specific test settings in `taito-testing-config.sh` using `test_` as prefix. You can access database in your tests as database proxy is run automatically in background (see `docker-compose-test.yaml`). If the test tools generate reports, screenshots or videos, they should be placed at the `/service/test/reports`, `/service/test/screenshots` and `/service/test/videos` directories.

Tests are grouped in test suites (see the `test-suites` files). All test suites can be kept independent by cleaning up data before each test suite execution by running `taito init --clean`. You can enable data cleaning in `taito-testing-config.sh` with the `ci_exec_test_init` setting, but you should use it for dev environment only.

You can run integration and end-to-end tests manually with the `taito test[:TARGET][:ENV] [SUITE] [TEST]` command, for example `taito test:server:dev`. When executing tests manually, the development container (`Dockerfile`) is used for executing the tests.
