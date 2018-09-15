# server-template

[//]: # (TEMPLATE NOTE START)

Server-template is a project template for applications and APIs running on server. The server-template is based on running containers on docker-compose or Kubernetes, but in the future it will also provide support for running functions on top of popular FaaS platforms. Thus, you can deploy the same implementation almost anywhere, and you can operate it with the same *taito-cli* commands regardless of the underlying platform.

The template comes with an example implementation that is based on React, Node.js, Postgres and S3, but you can easily replace them with other technologies (see [server-template-alt](https://github.com/TaitoUnited/server-template-alt)).

You can create a new project from this template by running `taito template create: server-template`. Later you can upgrade your project to the latest version of the template by running `taito template upgrade`. To ensure flawless upgrade, do not modify files that have a **do-not-modify** note in them as they are designed to be reusable and easily configurable for various needs. In such case, improve the original files of the template instead, and then upgrade.

You can also migrate an existing non-taito-cli project by running `taito template migrate: server-template` in your project root folder. If, however, you are not going to use docker containers or functions on your production environment, see the [legacy-server-template](https://github.com/TaitoUnited/legacy-server-template) instead.

[//]: # (TEMPLATE NOTE END)

Project specific documentation is located in `PROJECT.md`. Remember to update it if you make changes related to architecture, integrations, or processing of personal data (GDPR).

Table of contents:

* [Links](#links)
* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Automated tests](#automated-tests)
* [Structure](#structure)
* [Version control](#version-control)
* [Database migrations](#database-migrations)
* [Deployment](#deployment)
* [Configuration](#configuration)

## Links

Non-production basic auth credentials: TODO

[//]: # (GENERATED LINKS START)

LINKS WILL BE GENERATED HERE

[//]: # (GENERATED LINKS END)

> You can update this section by configuring links in `taito-config.sh` and running `taito project docs`.

## Prerequisites

* [node.js](https://nodejs.org/)
* [docker-compose](https://docs.docker.com/compose/install/)

Optional but highly recommended:

* [taito-cli](https://github.com/TaitoUnited/taito-cli#readme)
* eslint and prettier plugins for your code editor

## Quick start

Install linters and some libraries on host (add `--clean` for clean reinstall):

    taito install

Start containers (add `--clean` for clean rebuild):

    taito start

Make sure that everything has been initialized (e.g database) (add `--clean` for clean reinit):

    taito init

Open app in browser:

    taito open app

Open admin GUI in browser:

    taito open admin

Show user accounts and other information that you can use to log in:

    taito info

Access database:

    taito db connect                        # access using a command-line tool
    taito db proxy                          # access using a database GUI tool
    taito db import: ./database/file.sql    # import a sql script to database

Run tests:

    taito unit                              # run all unit tests
    taito unit:server                       # run unit tests of server
    taito unit:server trip                  # run the 'trip' unit test of server
    taito test                              # run all integration and end-to-end tests
    taito test:client                       # run integration and end-to-end tests of client
    taito test:client billing receipt       # run the receipt test of billing test suite of client

Start shell on a container:

    taito shell:admin
    taito shell:client
    taito shell:server

Stop containers:

    taito stop

List all project related links and open one of them in browser:

    taito open -h
    taito open NAME

Check bundle size and dependencies:

    taito check size
    taito check size:client
    taito check deps
    taito check deps:server
    taito check deps:server -u             # update packages interactively
    taito check deps:server -y             # update all packages (non-iteractive)

> NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused. But all unused `dependencies` can usually be removed from package.json.

Cleaning:

    taito clean:admin                       # Remove admin container image
    taito clean:client                      # Remove client container image
    taito clean:server                      # Remove server container image
    taito clean:database                    # TODO: does not work
    taito clean:npm                         # Delete node_modules directories
    taito clean                             # Clean everything

The commands mentioned above work also for server environments (`feat-NAME`, `dev`, `test`, `stag`, `canary`, `prod`). Some examples for dev environment:

    taito open app:dev                      # Open application in browser
    taito open admin:dev                    # Open admin GUI in browser
    taito info:dev                          # Show info
    taito status:dev                        # Show status of dev environment
    taito test:dev                          # Run integration and e2e tests
    taito shell:server:dev                  # Start a shell on server container
    taito logs:server:dev                   # Tail logs of server container
    taito open logs:dev                     # Open logs on browser
    taito open storage:dev                  # Open storage bucket on browser
    taito init:dev --clean                  # Clean reinit for dev environment
    taito db connect:dev                    # Access database on command line
    taito db proxy:dev                      # Start a proxy for database access
    taito db rebase:dev                     # Rebase database by redeploying all migrations
    taito db import:dev ./database/file.sql # Import a file to database
    taito db dump:dev                       # Dump database to a file
    taito db log:dev                        # Show database migration logs
    taito db revert:dev XXX                 # Revert database to change XXX
    taito db deploy:dev                     # Deploy data migrations to database
    taito db recreate:dev                   # Recreate database
    taito db diff:dev test                  # Show diff between dev and test schemas
    taito db copy to:dev test               # Copy test database to dev

Run `taito -h` to get detailed instructions for all commands. Run `taito COMMAND -h` to show command help (e.g `taito vc -h`, `taito db -h`, `taito db import -h`). For troubleshooting run `taito --trouble`. See PROJECT.md for project specific conventions and documentation.

> If you run into authorization errors, authenticate with the `taito --auth:ENV` command.

> It's common that idle applications are run down to save resources on non-production environments. If your application seems to be down, you can start it by running `taito start:ENV`, or by pushing some changes to git.

### Without taito-cli

You can run this project without taito-cli, but it is not recommended as you'll lose many of the additional features that taito-cli provides.

Local development:

    npm install             # Install some libraries
    npm run install-dev     # Install some libraries
    docker-compose up       # Start wordpress and database
    npm run                 # Show all scripts that you can run with npm
    TODO: sqitch db deploy  # Requires [sqitch for postgres](http://sqitch.org/))

CI/CD:

Taito-cli supports various infrastructures and technologies out-of-the-box, and you can also extend it by writing custom plugins. But if you want to build and deploy the project without taito-cli, you'll have to write the CI scripts yourself.

## Automated tests

### Unit tests

All unit tests are run automatically during build (see the `Dockerfile.build` files). You can use any test tools that have been installed as development dependency inside the container. Test reports should be placed at the `/xxx/test/reports` directory.

You can run unit tests also in local environment with the `taito unit[:TARGET]` command, for example `taito unit:client`.

> You can execute also browser and api tests using the same 'unit test' mechanism if you just mock the required APIs or DAOs so that the whole test can be run within one container.

### Integration and end-to-end tests

All integration and end-to-end test suites are run automatically after application has been deployed to dev environment. You can use any test tools that have been installed as development dependency inside the `builder` container (see `Dockerfile.build`). Settings defined in `taito-config.sh` are passed to the tests, so you can specify your environment specific test settings there. You can also access the database as database proxy is run automatically in background and secrets are passed as environment variables to the tests. Test reports should be placed at the `/xxx/test/reports` directory.

Tests are grouped in test suites (see `test-suites` files). All test suites are kept independent by cleaning up data before each test suite execution by running `taito init --clean`. If automatic data cleanup is not necessary, you can turn it off with the `ci_exec_test_init` setting in `taito-config.sh`.

You can run integration and end-to-end tests manually with the `taito test[:TARGET][:ENV] [SUITE] [TEST]` command, for example `taito test:server:dev`. When executing tests manually, the development container (`Dockerfile`) is used for executing the tests.

> Once you have implemented your first integration or e2e test, enable the CI test execution by setting `ci_exec_test=true` for dev environment.

## Structure

> This section provides some common guidelines only. Project specific conventions are defined in PROJECT.md.

An application should be divided in loosely coupled highly cohesive parts by using a modular directory structure. Some benefits of this kind of structure:

* When making a change, it's easier to see how widely the change might affect the application.
* When implementing a new feature, there is no need to jump around in the codebase as much.
* It's easier for a new developer to implement new features without knowing the whole codebase.
* Once the application grows, it's easier to split it into smaller parts that can be built and deployed independently.
* Once the application grows and time passes, it's easier to rewrite some parts of the application using a newer technology without affecting the other parts.

The following guidelines usually work well at least for a GUI implementation. You might need to break the guidelines once in a while, but still try to keep directories loosely coupled.

* Create directory structure mainly based on domain concepts or features (`area`, `billing`, `trip`, `user`, ...) instead of technical type or layer (`actions`, `containers`, `components`, `css`, `utils`, ...).
* Use such file naming that you can easily determine the type from a filename (e.g. `*.util.js`, `*.api.js`). This way you don't need to use additional directories for grouping files by type. Thus, you can freely place a file wherever it is needed. NOTE: It is ok to exclude type from GUI component filenames to keep import statements shorter. Just make sure that you can easily determine type and responsibility from a filename, and that you use the same naming convention throughout the codebase.
* A directory should not contain any references outside of its boundary; with the exception of references to libraries and common directories. You can think of each directory as an independent concept (or subconcept), and each `common` directory as a library that is shared among closely related concepts (or subconcepts).
* A file should contain only nearby references (e.g. references to files in the same directory or in a subdirectory directly beneath it); with the exception of references to libraries and common directories, of course.
* You cannot always follow the dependency guidelines mentioned above. If you break the guidelines, at least try to avoid making circular dependencies between directories. Also leave a `REFACTOR:` comment if the dependency is the kind that it should be refactored later.

See [SERVER-TEMPLATE/client/src](https://github.com/TaitoUnited/SERVER-TEMPLATE/tree/master/client/src) as an example.

## Version control

You can manage environment and feature branches using taito-cli. Some examples:

    taito vc env list                # List all environment branches
    taito vc env: dev                # Switch to the dev environment branch
    taito vc env merge               # Merge the current environment branch to the next environment branch

    taito vc feat list               # List all feature branches
    taito vc feat: pricing           # Switch to the pricing feature branch
    taito vc feat rebase             # Rebase current feature branch with dev branch
    taito vc feat merge              # Merge current feature branch to the dev branch, optionally rebase first
    taito vc feat squash             # Merge current feature branch to the dev as a single commit
    taito vc feat pr                 # Create a pull-request for merging current feature branch to the dev branch

> Alternatively you can use git commands directly. Just remember that merge between environment branches should always be executed as fast-forward and changes should be merged in the correct order: (`feat-NAME`) -> `dev` -> `test` -> `stag` -> `canary` -> `master`. You should not commit any changes directly to test, stag, canary or master branches.

### Development branches

Development is executed in dev and feature branches. Using feature branches is optional, but they are recommended to be used at least in the following situations:

* **Making changes to existing production functionality**: Use feature branches and pull-requests for code reviews. This will decrease the likelyhood that the change will brake something in production. It is also easier to keep the release log clean by using separate feature branches.
* **A new project team member**: Use pull-requests for code reviews. This way you can help the new developer in getting familiar with the coding conventions and application logic of the project.
* **Teaching a new technology**: Pull-requests can be very useful in teaching best practices for an another developer.

Code reviews are very important at the beginning of a new software project, because this is the time when the basic foundation is built for the future development. At the beginning, however, it is usually more sensible to do occasional code reviews across the entire codebase instead of feature specific code reviews based on pull-requests.

Note that most feature branches should be short-lived and located only on your local git repository, unless you are going to make a pull-request.

### Commit messages

All commit messages must be structured according to the [Conventional Commits](http://conventionalcommits.org/) convention as application version number and release notes are generated automatically during release by the [semantic-release](https://github.com/semantic-release/semantic-release) library. Commit messages are automatically validated before commit. You can also edit autogenerated release notes afterwards in GitHub (e.g. to combine some commits and clean up comments). Couple of commit message examples:

```
feat(dashboard): Added news on the dashboard.
```

```
docs: Added news on the dashboard.

[skip ci]
```

```
fix(login): Fixed header alignment.

Problem persists with IE9, but IE9 is no longer supported.

Closes #87, #76
```

```
feat(ux): New look and feel

BREAKING CHANGE: Not really breaking anything, but it's a good time to
increase the major version number.
```

Meanings:
* Closes #xx, #xx: Closes issues
* Issues #xx, #xx: References issues
* BREAKING CHANGE: Introduces a breaking change that causes major version number to be increased in the next production release.
* [skip ci]: Skips continuous integration build when the commit is pushed.

You can use any of the following types in your commit message. Use at least types `fix` and `feat`.

* `wip`: Work-in-progress (small commits that will be squashed later to one larger commit before merging them to one of the environment branches)
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Code formatting
* `refactor`: Refactoring
* `perf`: Performance tuning
* `test`: Implementing missing tests or correcting existing ones
* `revert`: Revert previous commit.
* `build`: Build system changes
* `ci`: Continuous integration changes (cloudbuild.yaml)
* `chore`: maintenance

## Database migrations

> If the environments do not yet contain any permanent data, you can just edit the existing deploy sql files directly and run `taito init:ENV --clean` before deploying the app to the environment. However, if you delete some of the existing `deploy/*.sql` files, leave revert scripts in place. Otherwise `taito init:ENV --clean` will fail because changes cannot be reverted.

Add a new migration:

1. Add a new step to migration plan:

    `taito db add: NAME`, for example: `taito db add: role_enum'`

2. Modify database/deploy/NAME.sql, database/revert/NAME.sql and database/verify/NAME.sql

3. Deploy the change to your local database:

    `taito db deploy`

The CI/CD tool will deploy your database changes automatically to servers once you push your changes to git. Database migrations are executed using sqitch. More instructions on sqitch: [Sqitch tutorial](https://metacpan.org/pod/sqitchtutorial)

> It is recommended that you put a table name at the beginning of your migration script name. This way the table creation script and all its alteration scripts remain close to each other in the file hierarchy.

> REMINDER: Do not forget indexing. Once in a while you should review sql queries made by the application and check that essential indexes are in place in the database.

## Deployment

Deploying to different environments:

* feat-NAME: Push to feat-NAME branch.
* dev: Push to dev branch.
* test: Merge changes to test branch using fast-forward.
* stag: Merge changes to stag branch using fast-forward.
* canary: Merge changes to canary branch using fast-forward. NOTE: Canary environment uses production resources (database, storage, 3rd party services) so be careful with database migrations.
* prod: Merge changes to master branch using fast-forward. Version number and release notes are generated automatically by the CI/CD tool.

> You can use taito-cli to [manage environment branches](#version-control). Feat-NAME, test, stag and canary environments are optional.

> Automatic deployment might be turned off for critical environments (`ci_exec_deploy` setting in `taito-config.sh`). In such case the deployment must be run manually with the `taito -a deployment deploy:prod VERSION` command using an personal admin account after the CI/CD process has ended successfully.

Advanced features:

* **Quick deploy**: If you are in a hurry, you can build, push and deploy a container directly to server with the `taito deployment build:TARGET:ENV` command e.g. `taito deployment build:client:dev`.
* **Copy production data to staging**: Often it's a good idea to copy production database to staging before merging changes to the stag branch: `taito db copy to:stag prod`. If you are sure nobody is using the production database, you can alternatively use the quick copy (`taito db copyquick to:stag prod`), but it disconnects all other users connected to the production database until copying is finished and also requires that both databases are located in the same database cluster.
* **Feature branch**: You can create also an environment for a feature branch: Destroy the old environment first if it exists (`taito env destroy:feat`) and create a new environment for your feature branch (`taito env apply:feat BRANCH`). Currently only one feature environment can exist at a time and therefore the old one needs to be destroyed before the new one is created.
* **Revert app**: Revert application and database to the previous revision by running `taito deployment revert:ENV` (application and database steps are confirmed separately). If you need to revert to a specific revision, check current revision by running `taito deployment revision:ENV` first and then revert to a specific revision by running `taito deployment revert:ENV REVISION`.
* **Debugging CI builds**: You can build and start production containers locally with the `taito start --clean --prod` command. You can also run any CI build steps defined in cloudbuild.yaml locally with taito-cli.

> Some of the advanced operations might require admin credentials (e.g. staging/canary/production operations). If you don't have an admin account, ask devops personnel to execute the operation for you.

## Configuration

### Configuration for local development

Done:
* [ ] GitHub settings
* [ ] Stack configuration
* [ ] Removal of irrelevant examples

#### GitHub settings

Recommended settings for most projects.

Options:
* Data services: Allow GitHub to perform read-only analysis: on
* Data services: Dependency graph: on
* Data services: Vulnerability alerts: on

Branches:
* Default branch: dev
* Protected branch: master (TODO: more protection settings)

Collaborators & teams:
* Teams: Select admin permission for the Admins team
* Teams: Select write permission for the Developers team
* Collaborators: Add additional collaborators if required.
* Collaborators: Remove repository creator (= yourself) from the collaborator list (NOTE: You may want to hold on to your admin rights until you have configured all GitHub settings properly and created a [server environment for development](#configuration-for-server-environments))

> On critical projects you should grant write permissions only for those, who really require write access.

#### Stack configuration

* **Authentication:** Authentication has not yet been implemented (see [issue](https://github.com/TaitoUnited/server-template/issues/11)). Currently ingress does provide basic authentation, but it is only meant for hiding non-production environments.
* **Flow/typescript:** You can enable flow or typescript by going through parts with `NOTE: for flow` or `NOTE: for typescript` note. (TODO: implement typescript support)
* **Alternative technologies:** If you would rather use other technologies than react and node.js, you can copy alternative example implementations from [SERVER-TEMPLATE-alt](https://github.com/TaitoUnited/SERVER-TEMPLATE-alt/).

The template supports unlimited number of (micro-)services. You can add new services like this:

1. Create a new directory for your service. Look [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) and [SERVER-TEMPLATE-alt](https://github.com/TaitoUnited/SERVER-TEMPLATE-alt/) for examples.
2. Add the service to `taito_targets` variable in `taito-config.sh`
3. Add the service to `docker-compose.yaml` and check that it works ok in local development environment.
4. Add the service to `scripts/helm.yaml`.

#### Examples

> To see the examples, start your local development environment first (see [quick start](#quick-start))

The project template comes with a bunch of implementation examples. Browse the examples through, leave the ones that seem useful and remove all the rest. You can use the `taito check deps` command to prune unused dependencies. NOTE: Many of the `devDependencies` and `~` references are actually in use even if reported unused by the tool. But all unused `dependencies` may usually be removed from package.json.

The client GUI uses [Material-UI](https://material-ui-next.com/) component library by default. It's a good match with the [react-admin](https://github.com/marmelab/react-admin) GUI, but please consider also other alternatives based on customer requirements. For example [Elemental](http://elemental-ui.com/) is a good alternative.

### Configuration for server environments

Done:
* [ ] Basic project settings
* [ ] Dev environment
* [ ] Prod environment

#### Basic settings

1. Modify `taito-config.sh` if you need to change some settings. The default settings are ok for most projects.
2. Run `taito project apply`
3. Commit and push changes

#### Environments

Define environments with the `taito_environments` setting in `taito-config.sh`. You can create an environment by running `taito env apply:ENV`. Examples for environment names: `feat-orders`, `dev`, `test`, `stag`, `canary`, `prod`.

If basic auth is used only for hiding non-production environments, you can use the same credentials for all environments. You should also write them down to the [Links](#links) section so that all project personnel can easily access the credentials.

NOTE: You should remove unnecessary examples from database migrations (`./database`) and secrets (`taito-config.sh`) before creating the first server environment.

NOTE: Operations on production and staging environments usually require admin rights. Please contact devops personnel if necessary.

#### Kubernetes

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. By modying these files you can easily configure environment variables, resource requirements and autoscaling for your containers.

You deploy configuration changes without rebuilding with the `taito deployment deploy:ENV` command.

> Do not modify the helm template located in `./scripts/helm` directory. Improve the original helm template located in [SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/) repository instead.

#### Secrets

1. Add a secret definition to `taito-config.sh` (taito_secrets)
2. Map secret to an environment variable in `scripts/helm.yaml`
3. Run `taito env rotate:ENV [SECRET]` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

> For local development you can just define secrets as normal environment variables in `docker-compose.yaml` given that they are not confidential.

### Upgrading to the latest version of the project template

Run `taito template upgrade`. The command copies the latest versions of reusable Helm charts, terraform templates and CI/CD scripts to your project folder, and also this README.md file. You should not make project specific modifications to them as they are designed to be reusable and easily configurable for various needs. Improve the originals instead, and then upgrade.
