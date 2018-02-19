> Create a new project from this template by running `taito template create: server-template`. You can also migrate an existing project to this template by running `taito template migrate: server-template` in your project root folder. Later you can upgrade your project to the latest version of the template by running `taito template upgrade`. To ensure flawless upgrade, do not modify files that have **do not modify** note in them as they are designed to be reusable and easily configurable for various needs. In such case, improve the original files in the template instead, and then upgrade.

# server-template

[//]: # (GENERATED LINKS START)

[admin:dev](https://server-template-dev.taitodev.com/admin/)
[admin:prod](https://server-template-prod.taitodev.com/admin/)
[app:dev](https://server-template-dev.taitodev.com)
[app:prod](https://server-template-prod.taitodev.com)
[builds](https://console.cloud.google.com/gcr/builds?project=gcloud-temp1&query=source.repo_source.repo_name%3D%22github-taitounited-server-template%22)
[docs](https://github.com/taitounited/server-template/wiki)
[errors:dev](https://sentry.io/taitounited/server-template/?query=is%3Aunresolved+environment%3Adev)
[errors:prod](https://sentry.io/taitounited/server-template/?query=is%3Aunresolved+environment%3Aprod)
[git](https://github.com/taitounited/server-template)
[logs:dev](https://console.cloud.google.com/logs/viewer?project=gcloud-temp1&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2Fkube1%2Fnamespace_id%2Fserver-template-dev)
[logs:prod](https://console.cloud.google.com/logs/viewer?project=gcloud-temp1&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2Fkube1%2Fnamespace_id%2Fserver-template-prod)
[project](https://github.com/taitounited/server-template/projects)
[storage:dev](https://console.cloud.google.com/storage/browser/server-template-dev?project=gcloud-temp1)
[storage:prod](https://console.cloud.google.com/storage/browser/server-template-prod?project=gcloud-temp1)
[uptime](https://app.google.stackdriver.com/uptime?project=gcloud-temp1)

[//]: # (GENERATED LINKS END)

> TODO add some notes for using the links: e.g. how to get an user account for logging in to the app and admin GUI.

## Prerequisites

* [taito-cli](https://github.com/TaitoUnited/taito-cli#readme)
* [docker-compose](https://docs.docker.com/compose/install/)
* eslint and prettier plugins for your code editor

## Quick start

Install linters locally (add `--clean` for clean reinstall):

    $ taito install

Start containers (add `--clean` for clean rebuild):

    $ taito start

Make sure that everything has been initialized (e.g database) (add `--clean` for clean reinit):

    $ taito init

Open app in browser:

    $ taito open app

Open admin GUI in browser:

    $ taito open admin

Show user accounts and other information that you can use to log in:

    $ taito info

Access database:

    $ taito db open                          # access using a command-line tool
    $ taito db proxy                         # access using a database GUI tool
    $ taito db import: ./database/file.sql   # import a sql script to database

Run all tests:

    $ taito unit          # unit tests
    $ taito test          # integration and end-to-end tests

Start shell on a container:

    $ taito shell: admin
    $ taito shell: client
    $ taito shell: server

Stop containers:

    $ taito stop

List all project related links and open one of them in browser:

    $ taito open -h
    $ taito open xxx

The commands listed above work also for server environments (`feature`, `dev`, `test`, `staging`, `prod`). Some examples for dev environment:

    $ taito open app:dev
    $ taito open admin:dev
    $ taito info:dev
    $ taito status:dev
    $ taito test:dev
    $ taito shell:dev server
    $ taito logs:dev server
    $ taito open logs:dev
    $ taito open storage:dev
    $ taito db open:dev
    $ taito db proxy:dev
    $ taito db import:dev ./database/file.sql
    $ taito db dump:dev
    $ taito db recreate:dev
    $ taito db diff:dev test
    $ taito db copy:dev test

Run `taito -h` to get detailed instructions for all commands. Run `taito COMMAND -h` to search for a command (e.g `taito git -h`, `taito db -h`, `taito import -h`). For troubleshooting run `taito --trouble`. See PROJECT.md for project specific conventions and documentation.

> If you run into authorization errors, authenticate with the `taito --auth:ENV` command.

> It's common that idle applications are run down to save resources on non-production environments. If your application seems to be down, you can start it by running `taito start:ENV`, or by pushing some changes to git.

## Automated tests

### Unit tests

All unit tests are run automatically during build (see `Dockerfile.build` files). You can run unit tests also in local environment with the `taito unit [CONTAINER]` command, for example `taito unit: client`.

> NOTE: You can execute also browser and api tests using the same 'unit test' mechanism if you just mock the required APIs or DAOs so that the whole test can be run within one container.

### Integration and end-to-end tests

All integration and end-to-end test suites are run automatically after application has been deployed to dev environment (see `Dockerfile.test` files). Integration and end-to-end tests are grouped in independent test suites (see `suite-*.sh` and `zuite-*.sh` files) and data is cleaned up before each them by running `taito init --clean`. If, however, data cleanup is not necessary, you can turn it off with the `ci_exec_test_init` setting in `taito-config.sh`.

You can run integration and end-to-end tests manually with the `taito test:ENV [CONTAINER] [SUITE]` command, for example `taito test:dev server suite-xx`. Environment specific test suite parameters are configured in `taito-config.sh` and they are passed to test suites in `package.json`.

## Structure

An application should be divided in loosely coupled highly cohesive parts by using a modular directory structure. The following rules usually work well for a GUI implementation. For a backend implementation you might need to break the rules once in a while, but still try to keep directories loosely coupled.

* Create directory structure mainly based on features (`reporting`, `users`, ...) instead of type (`actions`, `containers`, `components`, `css`, ...). Use such file naming that you can easily determine the type from filename (e.g. `*.ducks.js`, `*.container.js`). This way you don't need to use additional directories for grouping files by type.
* A directory should not contain any references outside of its boundary; with the exception of references to libraries and common directories. You can think of each directory as an independent feature (or subfeature), and each `common` directory as a library that is shared among closely related features (or subfeatures).
* A file should contain only nearby references (e.g. references to files in the same directory or in a subdirectory directly beneath it); with the exception of references to libraries and common directories, of course.
* If you break the dependency rules, at least try to avoid making circular dependencies between directories. Also leave a `REFACTOR:` comment if the dependency is the kind that it should be refactored later.
* Each block of implementation (function, class, module, sql query, ...) should be clearly named by its responsibility and implement only what it is responsible for, nothing else.

See [orig-template/client/app](https://github.com/TaitoUnited/orig-template/tree/master/client/app) as an example.

## Version control

### Development branches

Development is executed in dev and feature branches. Using feature branches is optional, but they are recommended to be used at least in the following situations:

* **Making changes to existing production functionality**: Use feature branches and pull-requests for code reviews. This will decrease the likelyhood that the change will brake something in production. It is also easier to keep the release log clean by using separate feature branches.
* **A new project team member**: Use pull-requests for code reviews. This way you can help the new developer in getting familiar with the coding conventions and application logic of the project.
* **Teaching a new technology**: Pull-requests can be very useful in teaching best practices for an another developer.

Code reviews are very important at the beginning of a new software project, because this is the time when the basic foundation is built for the future development. At the beginning, however, it is usually more sensible to do occasional code reviews across the entire codebase instead of feature specific code reviews based on pull-requests.

Note that most feature branches should be short-lived and located only on your local git repository, unless you are going to make a pull-request.

> TIP: Use the `taito git feat` commands to manage your feature branches.

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

> TIP: Optionally you can use `npm run commit` to write your commit messages by using commitizen, though often it is quicker to write commit messages by hand.

## Database Migrations

Add a new migration:

1. Add a new step to migration plan:

    `taito db add: NAME -r REQUIRES -n 'DESCRIPTION'`, for example:

    `taito db add: file.table -r user.table -r property.table -n 'Table for files'`

2. Modify database/deploy/xxx.sql, database/revert/xxx.sql and database/verify/xxx.sql

3. Deploy the change to your local database:

    `taito db deploy`

The CI/CD tool will deploy your database changes automatically to servers once you push your changes to git. Database migrations are executed using sqitch. More instructions on sqitch: [Sqitch tutorial](https://metacpan.org/pod/sqitchtutorial)

> It is recommended that you put a table name at the beginning of your migration script name. This way the table creation script and all its alteration scripts remain close to each other in the file hierarchy.

> REMINDER: Do not forget indexing. Once in a while you should review sql queries made by the application and check that essential indexes are in place in the database.

## Deployment

Deploying to different environments:

* dev: Push to dev branch.
* test: Merge changes to test branch. NOTE: Test environment is not mandatory.
* staging: Merge changes to staging branch. NOTE: Staging environment is not mandatory.
* prod: Merge changes to master branch. Version number and release notes are generated automatically by the CI/CD tool.

> TIP: Run `taito git env list` to list environment branches and `taito git env merge:ENV SOURCE_BRANCH` to merge an environment branch to another.

> NOTE: Automatic deployment might be turned off for critical environments (`ci_exec_deploy` setting in `taito-config.sh`). In such case the deployment must be run manually with the `taito -a manual deploy:prod VERSION` command using an admin account after the CI/CD process has ended successfully.

Advanced features:

* **Quick deploy**: If you are in a hurry, you can build, push and deploy a container directly to server with the `taito manual build deploy:ENV NAME` command e.g. `taito manual build deploy:dev client`.
* **Copy production data to staging**: Often it's a good idea to copy production database to staging before merging changes to the staging branch: `taito db copy:staging prod`. If you are sure nobody is using the production database, you can alternatively use the quick copy (`taito db copyquick:staging prod`), but it disconnects all other users connected to the production database until copying is finished and also requires that both databases are located in the same database cluster.
* **Feature branch**: You can create also an environment for a feature branch: Delete the old environment first if it exists (`taito env delete:feature`) and create a new environment for your feature branch (`taito env create:feature BRANCH`). Currently only one feature environment can exist at a time and therefore the old one needs to be deleted before the new one is created.
* **Alternative environments** TODO implement: You can create an alternative environment for an environment by running `taito env alt create:ENV`. An alternative environment uses the same database as the main environment, but containers are built from an alternative branch. You can use alternative environments e.g. for canary releases or A/B testing by redirecting some of the users to the alternative environment.
* **Revert app**: Revert application and database to the previous revision by running `taito manual revert:ENV` (application and database steps are confirmed separately). If you need to revert to a specific revision, check current revision by running `taito manual revision:ENV` first and then revert to a specific revision by running `taito manual revert:ENV REVISION`.
* **Debugging CI builds**: You can build and start production containers locally with the `taito start --clean --prod` command. You can also run any CI build steps defined in cloudbuild.yaml locally with taito-cli.

NOTE: Some of the advanced operations might require admin credentials (e.g. staging/production operations). If you don't have an admin account, ask devops personnel to execute the operation for you.

## Configuration for local development

### Git

Recommended settings for git repository:

* Options - Data services:
  * Allow GitHub to perform read-only analysis of this repository: on
  * Vulnerability alerts: on
* Teams - Developers team: write permission
* Teams - Admins team: admin permission
* Collaborators - Remove admin permission from the repository creator.
* Branches - Default branch: dev
* Branches - Protected branch: master (TODO more protection settings)

### Stack

The [orig-template](https://github.com/TaitoUnited/orig-template/) comes with preconfigured stack components that you can use. Change the stack by modifying the following files:

* `docker-compose.yaml`: containers for local development.
* `docker-nginx.conf`: 'ingress' for local development.
* `package.json`: some container specific scripts.
* `taito-config.sh`: the `ci_stack` setting.
* `scripts/helm.yaml`: the `stack` setting at the beginning of file.
* `cloudbuild.yaml`: the `images` setting at the beginning of file.

Remove stack components that you don't need. If you later need to add stack components, see [orig-template](https://github.com/TaitoUnited/orig-template/) for examples.

If you would rather use vue instead of react, copy example implementation from `client-vue` to your client directory. If you would rather use python instead of node.js, copy `server-py` to your server directory.

### Examples

The project template comes with a bunch of implementation examples. Browse them through, leave the ones that seem useful and delete all the rest.

The client GUI uses the [Material-UI](https://material-ui-next.com/) component library by default. It's a good match with the [admin-on-rest](https://github.com/marmelab/admin-on-rest) GUI, but please consider also other alternatives based on customer requirements. For example [Elemental](http://elemental-ui.com/) is a good alternative.

### Additional steps for a migrated project

TODO Something about additional steps if an old project was migrated.
The following implementation changes:

* Dockerfiles --> also for local development?
* Stackdriver
* Sentry
* Secrets
* Storage
* Queues
* Cron jobs

## Configuration for server environments

### Basic settings

1. Configure `taito-config.sh` if you need to change some settings. The default settings are ok for most projects.
2. Run `taito project config`
3. Commit and push changes

### Environments

> NOTE: You should remove unnecessary examples from database migrations (`./database`) and secrets (`taito-config.sh`) before creating the first server environment.

> NOTE: All operations on production and staging environments require admin rights. Please contact devops personnel.

Run `taito env create:ENV` to create an environment (`feature`, `dev`, `test`, `staging` or `prod`).

To setup DNS and monitoring for the production environment, run `taito env finalize:prod`.

TODO terraform configuration

### Kubernetes

The `scripts/heml.yaml` file contains default Kubernetes settings for all environments and the `scripts/helm-*.yaml` files contain environment specific overrides for them. By modying these files you can easily configure environment variables, resource requirements and autoscaling for your containers.

> NOTE: Do not modify the helm template located in `./scripts/helm` directory. Improve the original helm template located in [orig-template](https://github.com/TaitoUnited/orig-template/) repository instead.

### Secrets

1. Add a secret definition to `taito-config.sh` (taito_secrets)
2. Map secret to an environment variable in `scripts/helm.yaml`
3. Run `taito env rotate:ENV [SECRET]` to generate a secret value for an environment. Run the command for each environment separately. Note that the rotate command restarts all pods in the same namespace.

> NOTE: For local development you can just define secrets as normal environment variables in `docker-compose.yaml` given that they are not confidential.

## Upgrading to the latest version of the project template

Run `taito template upgrade`. The command copies the latest versions of reusable Helm charts, terraform templates and CI/CD scripts to your project folder, and also this README.md file. You should not make project specific modifications to them as they are designed to be reusable and easily configurable for various needs. Improve the originals instead, and then upgrade.
