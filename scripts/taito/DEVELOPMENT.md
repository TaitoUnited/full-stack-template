# Development

This file has been copied from [FULL-STACK-TEMPLATE](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/). Keep modifications minimal and improve the [original](https://github.com/TaitoUnited/FULL-STACK-TEMPLATE/blob/dev/scripts/taito/DEVELOPMENT.md) instead. Project specific conventions are located in [README.md](../../README.md#conventions). See the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial) for more thorough development instructions.

Table of contents:

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Development tips](#development-tips)
- [Code structure](#code-structure)
- [Version control](#version-control)
- [Database migrations](#database-migrations)
- [Code generation](#code-generation)
- [Deployment](#deployment)
- [Upgrading](#upgrading)
- [Configuration](#configuration)

## Prerequisites

- [Node.js (LTS version)](https://nodejs.org/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Taito CLI](https://taitounited.github.io/taito-cli/) (or see [TAITOLESS.md](TAITOLESS.md))
- Some editor plugins depending on technology (e.g. [ESLint](https://eslint.org/docs/user-guide/integrations#editors) and [Prettier](https://prettier.io/docs/en/editors.html) for JavaScript/TypeScript)

## Quick start

> TIP: Start application in a cleaned and initialized local environment with a single command: `taito develop`. This is essentially the same thing as running `taito env apply --clean`, `taito start --clean`, and `taito init`. If the application fails to start, run `taito trouble` to see troubleshooting.

Create local environment by installing some libraries and generating secrets (add `--clean` to recreate clean environment):

    taito env apply

Start containers (add `--clean` to make a clean rebuild and to discard all data, add `--init` to run `taito init` automatically after start):

    taito start

Make sure that everything has been initialized (e.g database, generated schemas) (add `--clean` to make a clean reinit):

    taito init

Open client GUI in browser:

    taito open client

Open admin GUI in browser:

    taito open admin

Open server API in browser:

    taito open server

Open Graphql playground in browser:

    taito open graphql

> TIP: You might find example queries and additional instructions in `server/test/graphql`.

Open www site in browser:

    taito open www

Open storage bucket in browser:

    taito open bucket

Show user accounts and other information that you can use to log in:

    taito info

Start and open UI kit:

    taito uikit
    taito open uikit

Access database:

    taito db connect                        # access using a command-line tool
    taito db proxy                          # access using a database GUI tool
                                            # look docker-compose.yaml for database user credentials
    taito db import: ./database/file.sql    # import a sql script to database

Run tests:

    taito unit                              # run all unit tests
    taito unit:server                       # run unit tests of server
    taito unit:server format                # run 'format' unit tests of server

    taito test                              # run all integration and end-to-end tests
    taito test:server - post/queries        # run 'post/queries' tests of server default test suite
    taito test:server jest post/mutations   # run the 'post/mutations' tests of server jest test suite
    taito test:client                       # run all integration and end-to-end tests of client
    taito test:client - posts               # run the 'posts' test of client default test suite
    taito test:client cypress 'car*'        # run all 'car*' tests of client cypress test suite

> TIP: Use the already existing tests as an example.

Open Cypress user interface:

    taito cypress                           # open cypress for default target (client)
    taito cypress:client                    # open cypress for client
    taito cypress:admin                     # open cypress for admin

> TIP: Testing personnel may run Cypress against any remote environment without Taito CLI or docker. See `client/test/README.md` for more instructions.

Start shell on a container:

    taito shell:admin
    taito shell:client
    taito shell:server

Restart and stop:

    taito restart:server                    # restart the server container
    taito restart                           # restart all containers
    taito stop                              # stop all containers

List all project related links and open one of them in browser:

    taito open -h
    taito open NAME

Generate definitions (e.g. GraphQL schemas):

    taito generate                          # Generate for for all
    taito generate:client                   # Generate for client
    taito generate:server                   # Generate for server

Generate code:

    taito code generate                     # Generate code for all (WARNING: Overwrites all manual modifications)
    taito code generate userGroup           # Generate code for userGroup entity only
    taito code generate:server userGroup    # Generate server code for userGroup entity only

Check code quality:

    taito code check
    <!-- TODO
    taito code check:admin
    taito code check:client
    taito code check:server
    -->

Check build size:

    taito size check
    taito size check:client

Check dependencies (available updates, vulnerabilities):

    taito dep check
    taito dep check:server
    taito dep check:server -u               # update packages interactively
    taito dep check:server -y               # update all packages (non-iteractive)

> NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused. But all unused `dependencies` can usually be removed from package.json.

Cleaning:

    taito clean:admin                       # Remove admin container image
    taito clean:client                      # Remove client container image
    taito clean:server                      # Remove server container image
    taito clean:database                    # TODO: does not work
    taito clean:npm                         # Delete node_modules directories
    taito clean                             # Clean everything

The commands mentioned above work also for server environments (`f-NAME`, `dev`, `test`, `uat`, `stag`, `canary`, `prod`). Some examples for dev environment:

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
    taito open storage:dev                  # Open storage bucket on browser
    taito shell:server:dev                  # Start a shell on server container
    taito test:dev                          # Run integration and e2e tests
    taito cypress:client:dev                # Open cypress for client
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

Run `taito -h` to get detailed instructions for all commands. Run `taito COMMAND -h` to show command help (e.g `taito db -h`, `taito db import -h`). For troubleshooting run `taito trouble`. See [README.md](../../README.md) for project specific conventions and documentation.

> If you run into authorization errors, authenticate with the `taito auth:ENV` command.

> It's common that idle applications are run down to save resources on non-production environments. If your application seems to be down, you can start it by running `taito start:ENV`, or by pushing some changes to git.

## Development tips

### Performance tuning

Make sure Docker has enough resources available. On macOS and Windows you can set CPU, memory, and disk limits on Docker preferences.

Sometimes docker may start hogging up cpu on macOS and Windows. In such case, just restart docker.

If the cooling fans of your computer spin fast and the computer seems slow, a high cpu load (or too slow computer) might not be the only cause. Check that your computer is not full of dust, the environment is not too hot, and your computer is not running on low-energy mode to save battery. Many computers start to limit available cpu on too hot conditions, or when battery charge is low.

Docker volume mounts can be slow on non-Linux systems. The template uses _delegated_ volume mounts to mitigate this issue on macOS.

To get maximum performace on non-Linux system, you may also choose to run some of the services locally, if you have all the necessary dependencies installed on your host system. For example, to run the client locally, you can add the following lines to your `taito-user-config.sh`. Taito CLI will modify docker-compose.yaml and docker-nginx.conf accordingly on `taito start`.

```
docker_compose_local_services="full-stack-template-client:8080"
```

Note that you also need to start the local client manually with the necessary environment variables set, for example:

```
cd client
export COMMON_PUBLIC_PORT=9999
export API_URL=/api
npm run start
```

## Code structure

Project specific conventions are defined in [README.md](../../README.md#conventions). See [software design](https://taitounited.github.io/taito-cli/tutorial/b-software-design) appendix of the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial) for some tips on how to design a modular directory structure. You may also find more specific instructions in `client/README.md` and `server/README.md`.

## Version control

Development is done in `dev` and `feature/*` branches. Hotfixes are done in `hotfix/*` branches. You should not commit changes to any other branch.

All commit messages must be structured according to the [Angular git commit convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) (see also [Conventional Commits](http://conventionalcommits.org/)). This is because application version number and release notes are generated automatically for production release by the [semantic-release](https://github.com/semantic-release/semantic-release) library.

> You can also use `wip` type for such feature branch commits that will be squashed during rebase.

You can manage environment and feature branches using Taito CLI commands. Run `taito env -h`, `taito feat -h`, and `taito hotfix -h` for instructions. If you use git commands or git GUI tools instead, remember to follow the version control conventions defined by `taito conventions`. See [version control](https://taitounited.github.io/taito-cli/tutorial/03-version-control) chapter of the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial) for some additional information.

## Database migrations

Add a new migration:

1. Add a new step to migration plan:

   `taito db add NAME`, for example: `taito db add role_enum`

2. Modify database/deploy/NAME.sql, database/revert/NAME.sql and database/verify/NAME.sql

3. Deploy the change to your local database:

   `taito db deploy`

4. OPTIONAL: Generate code for you entity (See [Code generation](#code-generation)):

   `taito generate code NAME`

The CI/CD tool will deploy your database changes automatically to servers once you push your changes to git. Database migrations are executed using sqitch. More instructions on sqitch: [Sqitch tutorial](https://metacpan.org/pod/sqitchtutorial)

See [software design](https://taitounited.github.io/taito-cli/tutorial/b-software-design/#relational-database-design) appendix of the [Taito CLI tutorial](https://taitounited.github.io/taito-cli/tutorial) for some tips on how to design your database.

> If environments do not yet contain any permanent database data, you can just edit the existing deploy sql files directly and run `taito init:ENV --clean` before deploying the app to an environment. It is recommended to edit the files directly until the first production version has been released to keep migration files clean. However, if you delete some of the existing `deploy/*.sql` files, leave revert scripts in place. Otherwise `taito init:ENV --clean` will fail because changes cannot be reverted.

> It is recommended that you put a table name at the beginning of your migration script name. This way the table creation script and all its alteration scripts remain close to each other in the file hierarchy.

> REMINDER: Do not forget indexing. Once in a while you should review sql queries made by the application and check that essential indexes are in place in the database.

## Code generation

If your implementation supports code generation, you can execute it with `taito code generate`. For example:

    taito code generate                     # Generate code for all (WARNING: Overwrites all manual modifications)
    taito code generate userGroup           # Generate code for userGroup entity only
    taito code generate:server userGroup    # Generate server code for userGroup entity only

If your implementation doesn't compile after the code generation, fix the compilation errors. If your implementation consists of multiple modules, you may also want to move the generated code to a different folder than where it was generated by default. You may also want to execute `taito init` as it may generate some additional stuff based on your implementation.

The following chapters provide more tips on how you should most likely modify the generated code.

### GraphQL API generated from a database model

> WARNING: Database model is an implementation, and GraphQL API is an abstraction on top of that implementation that should provide business logic and hide all implementation details and obscurity of the database model. Therefore the generated GraphQL API may require more modifications than presented below. The code generation is there only to save time and improve uniformity of the implementation as a whole.

You need to modify the generated code at least for the following parts to make the GraphQL API complete:

- **Resolver:** Add some field resolvers in the generated resolver implementation.

To provide extended filtering capabilities, you may also want to:

- **Type:** Add more fields to the filter type.
- **DAO:** Join additional tables in SQL query to support those filter fields.

To implement proper business logic, you should:

- **Resolver/Service:** Review the generated mutations, modify them according your business logic, and remove unnecessary operations. If your business logic is not about creating, updating, and deleting entities, you need to replace the generated mutations with something else that describes your business logic better (for example **registerCarOwnership(...)**). Sometimes you need to delete the generated resolver and service altogether and implement the logic elsewhere (for example, comment of an issue might be better handled in IssueResolver/IssueService or IssueCommentResolver/IssueCommentService). Think what's best solution to get a good descriptive GraphQL API, and an implementation that's easy to maintain in the long run.
- **Type:** Remove fields that GraphQL API clients are not allowed view, create, or update. Add additional types if required.
- **Service:** Implement your business logic in services.

To implement proper authorization, you should:

- **AuthService/Service:** Add some authorization rules/logic. Remember to also validate input.

Later, if you need to optimize slow GraphQL queries, you may also want to:

- **DAO:** Prefetch some referenced entities.

> TIP: You can customize code generation by modifying the template files in **server/templates**.

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

> Automatic deployment might be turned off for critical environments (`ci_exec_deploy` setting in `scripts/taito/env-*.sh`). In such case the deployment must be run manually with the `taito -a deployment deploy:prod VERSION` command using a personal admin account after the CI/CD process has ended successfully.

## Upgrading

Run `taito project upgrade`. The command copies the latest versions of reusable Helm charts, terraform templates and CI/CD scripts to your project folder, and also this README.md file. You should not make project specific modifications to them as they are designed to be reusable and easily configurable for various needs. Improve the originals instead, and then upgrade.

> TIP: You can use the `taito -o ORG project upgrade` command also for moving the project to a different platform (e.g. from AWS to GCP).

## Configuration

See [CONFIGURATION.md](CONFIGURATION.md).
