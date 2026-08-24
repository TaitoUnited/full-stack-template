# Repository context

This is a Taito project: a full-stack app whose local development, infrastructure, and CI/CD are all driven by [Taito CLI](https://taitounited.github.io/taito-cli/) and configured through `taito-config.sh` and the `scripts/` directory.

The real documentation is in `docs/` — this file is only an index. Start at `docs/development.md`.

## Stack and layout

| Path | What it is |
| --- | --- |
| `client/` | React + Vite SPA. TanStack Router, Panda CSS, Lingui i18n, gql.tada for GraphQL. |
| `server/` | Node/TypeScript API. Domain-driven `src/<domain>/*.{resolver,service,dao,db}.ts`, `setup/` for boot code, `db/` for the Drizzle client, migrations and seeds. |
| `worker/` | Background job worker; reads jobs from Redis. |
| `shared/` | Code and the GraphQL schema shared into every container (symlinked as `<container>/shared`). |
| `database/` | `db.sql` init script and `data/*.sql` seed dumps imported on `taito init`. |
| `playwright/` | End-to-end tests. |
| `storage/` | Local Minio bucket contents (S3-compatible object storage). |
| `scripts/` | Taito CLI configuration, Helm and Terraform definitions. |
| `docs/` | Documentation. |
| `alternatives/` | Swap-in implementations of client/server in other stacks (Vue, Django, Flask, Micronaut, Remix, Symfony). Not built by default. |

Local containers (`taito_containers` in `scripts/taito/project.sh`): `client`, `server`, `worker`, `database`, `redis`, `storage`, `pgweb`, plus an nginx `ingress` fronting everything at <http://localhost:9999>.

## Local development

Starting, stopping, logs, shells, database access and tests all go through Taito CLI — read `.claude/skills/taito-cli/SKILL.md` before running any `taito` command, and always use an explicit `:local` target. `docs/development.md` has the full command reference.

Database migrations are Drizzle: edit `server/src/<domain>/<entity>.db.ts`, generate a migration with `npm run db:migrate:generate` in `server/`, apply it with `taito exec:server:local npm run db:migrate`. Details in `docs/database/migration.md`.

## Configuration

Config is bash variables sourced from `taito-config.sh`: `scripts/taito/config/main.sh` derives most `taito_*` and `db_database_*` values from `scripts/taito/config/defaults.sh` (zone/organisation defaults) and `scripts/taito/defaults.sh` (project identity). Project-specific settings you edit are `scripts/taito/project.sh` and the per-environment `scripts/taito/env-*.sh`. `taito config:local` prints the resolved values — the fastest way to find where a variable comes from.

`taito_target_env` is the actual environment (`local`, `dev`, `pr-123`, `canary`, `prod`); `taito_env` is the resource environment it maps to — PR environments reuse dev resources, canary reuses prod resources.

## Secrets

Secrets are declared as `name:method` pairs in `scripts/taito/project.sh`, mapped to container env vars or files in `docker-compose.yaml` (local), `scripts/helm.yaml` (Kubernetes) and `scripts/terraform.yaml` (serverless), and given values per environment with `taito secret rotate:ENV`. Local values are gitignored files under `secrets/local/`; remote values live in the cloud secret store. The full method list and the checklist for adding one are in `docs/cli/configuration.md`.

## Infrastructure

Containers are deployed with Helm, other cloud resources with Terraform. Both are configured through cloud-agnostic YAML that is `envsubst`-ed with the taito config variables before use:

- `scripts/helm.yaml` — services, ingress paths, env vars, secrets, resources, replicas, cron jobs. `scripts/helm-<env>.yaml` and `scripts/helm-<label>.yaml` override it per environment or PR label. Deployed by `taito deployment deploy:ENV`.
- `scripts/terraform.yaml` (+ `terraform-<env>.yaml`) — databases, buckets, queues, service accounts. Applied manually with `taito env apply:ENV`; CI/CD does not apply Terraform changes.

`scripts/helm/` is only a wrapper chart — its `requirements.yaml` pulls the shared `full-stack` chart from <https://taitounited.github.io/taito-charts/>, which is where the actual Kubernetes templates live. If a `helm.yaml` key looks undocumented, look it up in the [taito-charts](https://github.com/TaitoUnited/taito-charts) repo, or in the local reference copies `scripts/helm/values.yaml` and `scripts/helm/examples.yaml`. Bump the version in `requirements.yaml` to pick up chart changes.

Files under `scripts/helm/`, `scripts/terraform/` and `scripts/taito/config/` are reusable and get overwritten by `taito project upgrade` — configure things in the `*.yaml` / `*.sh` files above them instead. `docs/cli/infrastructure.md` explains the split.

## CI/CD

Branch equals environment: pushing to `dev` deploys dev, and fast-forward merges to `test`/`uat`/`stag`/`canary`/`master` deploy those. Pull requests get a `pr-N` environment that reuses dev resources with its own database.

The pipeline (`cloudbuild.yaml`, `.github/workflows/pipeline.yaml`, or whichever provider's file this project uses) runs a fixed sequence of Taito CLI commands inside the Taito CLI container image: `build-prepare` → `artifact-prepare:<target>` → `db-deploy` → `deployment-deploy` → `deployment-wait` → `test` → `deployment-verify` → `artifact-release:<target>` → `build-release`. Images are tagged with the commit SHA at prepare time and only re-tagged as released after the deployment verifies. Cloud credentials come from CI secrets, optionally prefixed by branch name. `taito ci run:dev` runs the pipeline locally.

## Conventions

Development happens on `dev` and `feature/*`, hotfixes on `hotfix/*`; a husky pre-commit hook blocks direct commits to environment branches. Commit messages follow Conventional Commits — `semantic-release` derives the production version and release notes from them. Pre-push runs generate, lint and unit tests. Linting and formatting is oxlint / oxfmt.

## Further reading

- `docs/development.md` — prerequisites, quick start, commands, deployment, upgrading
- `docs/cli/configuration.md` — secrets, adding services/databases/buckets, scheduled jobs, object storage
- `docs/cli/infrastructure.md` — what lives under `scripts/`
- `docs/database/` — migrations, seeding, operations
- `docs/client/`, `docs/server/`, `docs/testing/` — per-container guides
- `taito -h`, `taito COMMAND -h`, `taito trouble`
