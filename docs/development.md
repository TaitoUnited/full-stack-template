# Development

Table of contents:

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Version control](#version-control)
- [Deployment](#deployment)
- [Upgrading](#upgrading)

## Prerequisites

- [Node.js (LTS version)](https://nodejs.org/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Taito CLI](https://taitounited.github.io/taito-cli/) (or see [TAITOLESS.md](TAITOLESS.md))
- Some editor plugins depending on technology (e.g. [ESLint](https://eslint.org/docs/user-guide/integrations#editors) and [Prettier](https://prettier.io/docs/en/editors.html) for JavaScript/TypeScript)

## Quick start

First make sure your cloud auth is in effect with `taito auth:dev`. Then start the application in a cleaned and initialized local environment with a single command: `taito develop`. From there on you can start the application with `taito start` instead of running `taito develop`, which executes a full initialization in addition to starting the application. If the application fails to start, run `taito trouble` to see troubleshooting.

> The `taito develop` command runs `taito env apply --clean`, `taito start --clean`, and `taito init` commands under the hood. You can run these commands also separately, if you want to initialize only specific parts of the project.

## Essential commands

Show user accounts and other information that you can use to log in:

```sh
taito info
```

Open client GUI in browser:

```sh
taito open client
```

Open server API in browser:

```sh
taito open server
```

Open Graphql playground in browser:

```sh
taito open graphql
```

Open storage bucket named 'bucket' in browser:

```sh
taito open bucket   # Log in with minio / secret1234
```

Start and open UI kit:

```sh
taito uikit
taito open uikit
```

Some other useful links:

```sh
taito open git
taito open builds
```

Access database:

```sh
taito db connect                        # access using a command-line tool
taito db proxy                          # access using a database GUI tool look docker-compose.yaml for database user credentials
taito db import: ./database/file.sql    # import a sql script to database
```

Update secret values of local environment:

> TIP: See [Define a secret](https://taitounited.github.io/taito-cli/tutorial/06-env-variables-and-secrets/#64-define-a-secret) chapter on how to add a new secret definition.

```sh
taito auth:dev [--reset]                # Make sure your cloud authentication is still in effect as secret default values are read from dev.
taito secret rotate [NAME]              # Update all secrets or specific secret (TODO: alias 'taito secret update')
```

Run tests:

```sh
taito test                              # run all tests
taito test:client                       # run client tests
taito test:server                       # run server tests
taito test:server unit                  # run unit tests of server
taito test:server unit format           # run 'format' unit tests of server
taito test:server integration           # run integration tests of server
taito test:server api                   # run api tests of server
taito test:server api product           # run the 'product' tests of server api test suite
```

End-to-end tests:

```sh
taito playwright                        # run tests in headless mode
taito playwright:client                 # run tests only for client
taito playwright-ui                     # open test recording ui
taito playwright-debug                  # run tests with a visible browser window
```

Start shell on a container:

```sh
taito shell:admin
taito shell:client
taito shell:server
```

Restart and stop:

```sh
taito restart:server                    # restart the server container
taito restart                           # restart all containers
taito stop                              # stop all containers
```

List all project related links and open one of them in browser:

```sh
taito open -h
taito open NAME
```

Generate definitions (e.g. GraphQL schemas):

```sh
taito generate                          # Generate for for all
taito generate:client                   # Generate for client
taito generate:server                   # Generate for server
```

Cleaning:

```sh
taito clean:admin                       # Remove admin container image
taito clean:client                      # Remove client container image
taito clean:server                      # Remove server container image
taito clean:database                    # TODO: does not work
taito clean:npm                         # Delete node_modules directories
taito clean                             # Clean everything
```

The commands mentioned above work also for cloud environments (`f-NAME`, `dev`, `test`, `uat`, `stag`, `canary`, `prod`). Some examples for dev environment:

```sh
taito auth:dev                          # Authenticate to dev
taito env apply:dev                     # Create the dev environment
taito push                              # Push changes to current branch (dev)
taito open builds:dev                   # Show build status and build logs
taito open client:dev                   # Open client GUI in browser
taito open admin:dev                    # Open admin GUI in browser
taito info:dev                          # Show info
taito status:dev                        # Show status of dev environment
taito logs:server:dev                   # Tail logs of server container
taito open logs:dev                     # Open logs on browser
taito open bucket:dev                   # Open storage bucket named 'bucket' on browser
taito shell:server:dev                  # Start a shell on server container
taito test:dev                          # Run integration and e2e tests
taito init:dev --clean                  # Clean reinit for dev environment
taito db connect:dev                    # Access database on command line
taito db proxy:dev                      # Start a proxy for database access
taito secret show:dev                   # Show secrets (e.g. database user credentials)
taito db rebase:dev                     # Rebase database by redeploying all migrations
taito db import:dev ./database/file.sql # Import a file to database
taito db dump:dev                       # Dump database to a file
taito db log:dev                        # Show database migration logs
taito db revert:dev XXX                 # Revert database to change XXX
taito db deploy:dev                     # Deploy data migrations to database
taito db recreate:dev                   # Recreate database
taito db diff:dev test                  # Show diff between dev and test schemas
taito db copy between:test:dev          # Copy test database to dev
```

Run `taito -h` to get detailed instructions for all commands. Run `taito COMMAND -h` to show command help (e.g `taito db -h`, `taito db import -h`). For troubleshooting run `taito trouble`. See [README.md](README.md) for project specific conventions and documentation.

> [!TIP]
> If you run into authorization errors, authenticate with the `taito auth:ENV` command.
>
> It's common that idle applications are run down to save resources on non-production environments. If your application seems to be down, you can start it by running `taito start:ENV`, or by pushing some changes to git.

## Shared code

This `shared` directory is available for all Docker containers. You can use it for shared code, eg. utility functions, or shared configuration.

> [!IMPORTANT]
> Try to avoid sharing code that depends on some npm package as it may cause issues with bundlers.
> We might take advantage of [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) in the future to share code as internal packages.

## Version control

Development is done in `dev` and `feature/*` branches. Hotfixes are done in `hotfix/*` branches. You should not commit changes to any other branch.

All commit messages must be structured according to the [Angular git commit convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) (see also [Conventional Commits](http://conventionalcommits.org/)). This is because application version number and release notes are generated automatically for production release by the [semantic-release](https://github.com/semantic-release/semantic-release) library.

> [!TIP]
> You can also use `wip` type for such feature branch commits that will be squashed during rebase.

You can manage environment and feature branches using Taito CLI commands. Run `taito env -h`, `taito feat -h`, and `taito hotfix -h` for instructions. If you use git commands or git GUI tools instead, remember to follow the version control conventions defined by `taito conventions`. See [version control](https://taitounited.github.io/taito-cli/tutorial/03-version-control) chapter of the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial) for some additional information.

## Deployment

Container images are built for dev and feature branches only. Once built and tested successfully, the container images will be deployed to other environments on git branch merge:

- **f-NAME**: Push to the `feature/NAME` branch.
- **dev**: Push to the `dev` branch.
- **test**: Merge changes to the `test` branch using fast-forward.
- **uat**: Merge changes to the `uat` branch using fast-forward.
- **stag**: Merge changes to the `stag` branch using fast-forward.
- **canary**: Merge changes to the `canary` branch using fast-forward. NOTE: Canary environment uses production resources (database, storage, 3rd party services) so be careful with database migrations.
- **prod**: Merge changes to the `master` branch using fast-forward. Version number and release notes are generated automatically by the CI/CD tool.

Simple projects require only two environments: **dev** and **prod**. You can list the environments with `taito env list`.

You can use the taito commands to manage branches, builds, and deployments. Run `taito env -h`, `taito feat -h`, `taito hotfix -h`, and `taito deployment -h` for instructions. Run `taito open builds` to see the build logs. See [version control](https://taitounited.github.io/taito-cli/tutorial/03-version-control) chapter of the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial) for some additional information.

> [!IMPORTANT]
> Automatic deployment might be turned off for critical environments (`ci_exec_deploy` setting in `scripts/taito/env-*.sh`). In such case the deployment must be run manually with the `taito -a deployment deploy:prod VERSION` command using a personal admin account after the CI/CD process has ended successfully.

## Upgrading

Run `taito project upgrade`. The command copies the latest versions of reusable Helm charts, terraform templates and CI/CD scripts to your project folder, and also this README.md file. You should not make project specific modifications to them as they are designed to be reusable and easily configurable for various needs. Improve the originals instead, and then upgrade.

> [!TIP]
> You can use the `taito -o ORG project upgrade` command also for moving the project to a different platform (e.g. from AWS to GCP).
