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

## Prerequisites

* [Node.js](https://nodejs.org/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* Optional: [Taito CLI](https://github.com/TaitoUnited/taito-cli#readme)
* Optional: eslint and prettier plugins for your code editor

## Version control settings

Run `taito open vc conventions` in the project directory to see organization specific settings that you should configure for your git repository.

[ ] All done

## Stack

**Alternative technologies:** If you would rather use other technologies than React, Node.js and PostgreSQL, you can copy alternative example implementations from [alternatives](https://github.com/TaitoUnited/SERVER-TEMPLATE/tree/master/admin) directory.

**Additional microservices:** The template supports unlimited number of microservices. You can add a new microservice like this:

  1. Create a new directory for your service. Look [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) and [SERVER-TEMPLATE-alt](https://github.com/TaitoUnited/SERVER-TEMPLATE-alt/) for examples.
  2. Add the service to `taito_targets` variable in `taito-config.sh`
  3. Add the service to `docker-compose.yaml` and check that it works ok in local development environment.
  4. Add the service to `scripts/helm.yaml`.
  5. Add the service to `package.json` scripts: `install-all`, `lint`, `unit`, `test`, `check-deps`, `check-size`.
  6. Add the service to `cloudbuild.yaml`.

**Flow/TypeScript:** You can enable Flow or TypeScript by going through parts marked with a `NOTE: for flow` or `NOTE: for typescript` note. (TODO: implement typescript support)

**Minikube:** If you would rather use minikube for local development instead of docker-compose, remove `docker-compose:local` plugin, and the `:-local` restriction from `kubectl:-local` and `helm:-local` plugins. These are configured with the `taito_plugins` setting in `taito-config.sh`. (TODO: Not tested on minikube yet. Probably needs some additional work.)

**Authentication:** Authentication has not yet been implemented to the template (see [issue](https://github.com/TaitoUnited/SERVER-TEMPLATE/issues/11)). Currently ingress does provide basic authentation, but it is only meant for hiding non-production environments. [Auth0 docs](https://auth0.com/docs) is a good starting point for your auth implementation.

[ ] All done

## Examples

The project template comes with a bunch of implementation examples. Browse the examples through, leave the ones that seem useful and remove all the rest. You can use the `taito check deps` command to prune unused dependencies. NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused by the tool. But all unused `dependencies` may usually be removed from package.json.

The client GUI uses [Material-UI](https://material-ui-next.com/) component library by default. It's a good match with the [react-admin](https://github.com/marmelab/react-admin) GUI, but please consider also other alternatives based on customer requirements. For example [Elemental](http://elemental-ui.com/) is a good alternative.

[ ] All done

## Static site generator

Configure static site generator of your choice with the following instructions. Currently instructions are provided only for Gatsby, Hugo and Jekyll, but with some extra work the website-template may easily be used with any static site generator.

Start containers, and start a shell inside the www Docker container:

    taito install
    taito start
    taito shell:www

*FOR JEKYLL ONLY:* Create a new site:

    bash
    jekyll new site
    exit
    exit

*FOR HUGO ONLY:* Create a new Hugo site (See [Hugo quickstart](https://gohugo.io/getting-started/quick-start/) for more details):

    hugo new site site
    cd site
    git clone https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
    echo 'theme = "ananke"' >> config.toml
    hugo new posts/my-first-post.md
    exit

*FOR GATSBY ONLY:* Create a new Gatsby site based on one of the [starters](https://www.gatsbyjs.org/starters?v=2):

    npx gatsby new site STARTER-SOURCE-URL-OF-MY-CHOICE
    rm -rf site/.git
    exit

*FOR GATSBY ONLY:* Expose Gatsby development port outside the Docker container by adding options `--host 0.0.0.0 --port 8080` to the develop script:

    EDIT www/site/package.json

*FOR GATSBY ONLY:* Enable `/service/site/node_modules` mount in `docker-compose.yaml`:

    EDIT docker-compose.yaml

Restart containers and open the site on browser:

    taito stop
    taito start
    taito open www

Remove static site generators that you do not use from `www/install.sh`.

    EDIT www/install.sh

[ ] All done

## Hosting options

By default the template deploys the site to Kubernetes running on Google Cloud. TODO: Support for Docker Compose on virtual machine, AWS, Azure, Digital Ocean, Scaleway.

1. Modify `taito-config.sh` if you need to change some settings. The default settings are ok for most projects.
2. Run `taito project apply`
3. Commit and push changes

[ ] All done

## Remote environments

Define remote environments with the `taito_environments` setting in `taito-config.sh`. Make sure that your authentication is in effect for an environment with `taito --auth:ENV`, and then create an environment by running `taito env apply:ENV`. Examples for environment names: `f-orders`, `dev`, `test`, `stag`, `canary`, `prod`. Create a `dev` environment first, and the other environments later if required.

If basic auth (htpasswd) is used only for hiding non-production environments, you can use the same credentials for all environments. In such case you should also write them down to the [links](README.md#links) section on README.md so that all project personnel can easily access the credentials.

> If you have some trouble creating an environment, you can destroy it by running `taito env destroy:ENV` and then try again with `taito env apply:ENV`.

> See [6. Remote environments](https://github.com/TaitoUnited/taito-cli/blob/master/docs/tutorial/05-remote-environments.md) chapter of Taito CLI tutorial for more thorough instructions.

> Operations on production and staging environments usually require admin rights. Please contact DevOps personnel if necessary.

[ ] All done

## Kubernetes

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. By modying these files you can easily configure environment variables, resource requirements and autoscaling for your containers.

You can deploy configuration changes without rebuilding with the `taito deployment deploy:ENV` command.

> Do not modify the helm template located in `./scripts/helm` directory. Improve the original helm template located in [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) repository instead.

[ ] All done

## Secrets

1. Add a secret definition to the `taito_secrets` setting in `taito-config.sh`.
2. Map the secret definition to an environment variable in `scripts/helm.yaml`
3. Run `taito env rotate:ENV SECRET` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

> For local development you can just define secrets as normal environment variables in `docker-compose.yaml` given that they are not confidential.

[ ] All done
