# Configuration

> TIP: To save some time, start your application locally while you are configuring the project: `taito install`, `taito start`, `taito init`. NOTE: Requires [Node.js](https://nodejs.org/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on host.

This file has been copied from [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/SERVER-TEMPLATE/blob/dev/CONFIGURATION.md) instead. Note that Taito CLI is optional (see [usage without Taito CLI](DEVELOPMENT.md#usage-without-taito-cli)).

Table of contents:

* [Prerequisites](#prerequisites)
* [Version control settings](#version-control-settings)
* [Stack](#stack)
* [Examples](#examples)
* [Static site generator](#static-site-generator)
* [Hosting options](#hosting-options)
* [Remote environments](#remote-environments)
* [Kubernetes](#kubernetes)
* [Secrets](#secrets)
* [Automated tests](#automated-tests)

## Prerequisites

* [Node.js](https://nodejs.org/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* Optional: [Taito CLI](https://github.com/TaitoUnited/taito-cli#readme)
* Optional: eslint and prettier plugins for your code editor

## Version control settings

Run `taito open conventions` in the project directory to see organization specific settings that you should configure for your git repository.

* [ ] All done

## Stack

**Alternative technologies:** If you would rather use other technologies than React, Node.js and PostgreSQL, you can copy alternative example implementations from [alternatives](https://github.com/TaitoUnited/SERVER-TEMPLATE/tree/master/admin) directory.

**Additional microservices:** The template supports unlimited number of microservices. You can add a new microservice like this:

  1. Create a new directory for your service. Look [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) and [SERVER-TEMPLATE-alt](https://github.com/TaitoUnited/SERVER-TEMPLATE-alt/) for examples.
  2. Add the service to `taito_targets` variable in `taito-config.sh`
  3. Add the service to `docker-compose.yaml` and check that it works ok in local development environment.
  4. Add the service to `scripts/helm.yaml`.
  5. Add the service to `package.json` scripts: `install-all`, `lint`, `unit`, `test`, `check-deps`, `check-size`.
  6. Add the service to `cloudbuild.yaml`.

**Minikube:** If you would rather use minikube for local development instead of docker-compose, remove `docker-compose:local` plugin, and the `:-local` restriction from `kubectl:-local` and `helm:-local` plugins. These are configured with the `taito_plugins` setting in `taito-config.sh`. (TODO: Not tested on minikube yet. Probably needs some additional work.)

**Authentication:** Ingress provides basic authentication, but it is only meant for hiding non-production environments. Here are some good technologies for implementing authentication: [Auth0](https://auth0.com), [Passport](http://www.passportjs.org/), [ORY Oathkeeper](https://www.ory.sh/api-access-control-kubernetes-cloud-native).

**Static site generator (www):** See the next chapter.

* [ ] All done

## Static site generator (www)

Configure static site generator of your choice with the following instructions. Currently instructions are provided only for Gatsby, Hugo and Jekyll, but with some extra work the website-template may easily be used with any static site generator.

Remove static site generators that you do not use from `www/install.sh`.

    EDIT www/install.sh

Start containers, and start a shell inside the www Docker container:

    taito install
    taito start
    taito shell:www

*FOR GATSBY ONLY:* Create a new Gatsby site based on one of the [starters](https://www.gatsbyjs.org/starters?v=2):

    npx gatsby new site https://github.com/sarasate/gate
    rm -rf site/.git
    exit

*FOR GATSBY ONLY:* Edit some files:

    EDIT docker-compose.yaml         # Enable `/service/site/node_modules` mount
    EDIT www/site/gatsby-config.js   # Add pathPrefix setting: `pathPrefix: '/docs'`
    EDIT taito-config.sh             # Add link: `* www-local=http://localhost:7463/docs Local docs`

> The additional link is required because `commons.js` and `socket.io` are assumed to be running on `/` path (See [Gatsby.js issue](https://github.com/gatsbyjs/gatsby/issues/3721)).

*FOR HUGO ONLY:* Create a new Hugo site (See [Hugo themes](https://themes.gohugo.io/) and [Hugo quick start](https://gohugo.io/getting-started/quick-start/) for more details):

    hugo new site site
    cd site
    git clone https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
    rm -rf themes/ananke/.git
    echo 'theme = "ananke"' >> config.toml
    hugo new posts/my-first-post.md
    exit

*FOR HUGO ONLY:* If you have some trouble with links, you might also need to enable relative urls by using the following settings in `www/site/config.toml`:

    baseURL = ""
    relativeURLs = true

*FOR JEKYLL ONLY:* Create a new site:

    bash
    jekyll new site
    exit
    exit

Restart containers and open the site on browser:

    taito stop
    taito start --clean
    taito open www

* [ ] All done

## Examples

The project template comes with a bunch of implementation examples. Browse the examples through, leave the ones that seem useful and remove all the rest. You can use the `taito check deps` command to prune unused dependencies. NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused by the tool. But all unused `dependencies` may usually be removed from package.json.

The client GUI uses [Material-UI](https://material-ui-next.com/) component library by default. It's a good match with the [react-admin](https://github.com/marmelab/react-admin) GUI, but please consider also other alternatives based on customer requirements. For example [Elemental](http://elemental-ui.com/) is a good alternative.

* [ ] All done

## Hosting options

By default the template deploys the site to Kubernetes running on Google Cloud. TODO: Support for AWS, Azure, Digital Ocean, Scaleway.

1. Modify `taito-config.sh` if you need to change some settings. The default settings are ok for most projects.
2. Run `taito project apply`
3. Commit and push changes

* [ ] All done

## Remote environments

Define remote environments with the `taito_environments` setting in `taito-config.sh`. Make sure that your authentication is in effect for an environment with `taito --auth:ENV`, and then create an environment by running `taito env apply:ENV`. Examples for environment names: `f-orders`, `dev`, `test`, `stag`, `canary`, `prod`. Create a `dev` environment first, and the other environments later if required.

If basic auth (htpasswd) is used only for hiding non-production environments, you can use the same credentials for all environments. In such case you should also write them down to the [links](README.md#links) section on README.md so that all project personnel can easily access the credentials.

> If you have problems with `taito open builds`, see the next chapter.

> If you have some trouble creating an environment, you can destroy it by running `taito env destroy:ENV` and then try again with `taito env apply:ENV`.

> See [6. Remote environments](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/05-remote-environments.md) chapter of Taito CLI tutorial for more thorough instructions.

> Operations on production and staging environments usually require admin rights. Please contact DevOps personnel if necessary.

* [ ] All done

## Builds link

If `taito open builds` command does not work, you can fix it in `link_urls` setting of `taito-config.sh` by trying the following formats: `github_myorganization_`, `github-myorganization-`, `github_MyOrganization_`, `github-MyOrganization-`.

* [ ] All done

## Kubernetes

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. By modifying these files you can easily configure environment variables, resource requirements and autoscaling for your containers.

You can deploy configuration changes without rebuilding with the `taito deployment deploy:ENV` command.

> Do not modify the helm template located in `./scripts/helm` directory. Improve the original helm template located in [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) repository instead.

* [ ] All done

## Secrets

1. Add a secret definition to the `taito_secrets` setting in `taito-config.sh`.
2. Map the secret definition to an environment variable in `scripts/helm.yaml`
3. Run `taito env rotate:ENV SECRET` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

> For local development you can just define secrets as normal environment variables in `docker-compose.yaml` given that they are not confidential.

* [ ] All done

## Automated tests

### Unit tests

All unit tests are run automatically during build (see the `Dockerfile.build` files). You can use any test tools that have been installed as development dependency inside the container. If the test tools generate reports, they should be placed at the `/service/test/reports` (`./test/reports`) directory inside the container. You can run unit tests manually with the `taito unit` command (see help with `taito unit -h`).

* [ ] All done

### Integration and end-to-end tests

All integration and end-to-end test suites are run automatically after application has been deployed to dev environment. You can use any test tools that have been installed as development dependency inside the `builder` container (see `Dockerfile.build`). You can specify your environment specific test settings in `taito-config.sh` using `test_` as prefix. You can access database in your tests as database proxy is run automatically in background (see `docker-compose-test.yaml`). If the test tools generate reports, screenshots or videos, they should be placed at the `/service/test/reports`, `/service/test/screenshots` and `/service/test/videos` directories.

Tests are grouped in test suites (see the `test-suites` files). All test suites can be kept independent by cleaning up data before each test suite execution by running `taito init --clean`. You can enable data cleaning in `taito-config.sh` with the `ci_exec_test_init` setting, but you should use it for dev environment only.

You can run integration and end-to-end tests manually with the `taito test[:TARGET][:ENV] [SUITE] [TEST]` command, for example `taito test:server:dev`. When executing tests manually, the development container (`Dockerfile`) is used for executing the tests.

> Once you have implemented your first integration or e2e test, enable the CI test execution by setting `ci_exec_test=true` for dev environment.

* [ ] All done
