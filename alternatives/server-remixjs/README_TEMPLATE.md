# Remix.js template (with Drizzle ORM)

## Remix.js app

1. Create remix.js app by executing `npx create-remix@latest server` in the root directory of your project.
2. Change path `/api` into `/` in the following files:
   - **docker-nginx.conf**
   - **scripts/helm.yaml**
   - **scripts/taito/project.sh**

## Drizzle ORM

If you would like to use Drizzle ORM instead of plain SQL and Sqitch, execute the following steps:

1. Install Drizzle ORM for PostgreSQL with npm.
2. Set up Drizzle ORM so that it reads database connection details from `DATABASE_*` environment variables.
3. Add db-migrate script for running database migrations, for example: `"db-migrate": "ts-node src/db/migrate.ts"`
4. Disable Sqitch Taito CLI plugin by removing `sqitch-db` from **scripts/taito/project.sh**.
5. Enable Drizzle ORM migrations for Taito CLI and CI/CD by adding the following script on the package.json file located on project root:

```
    "taito-host-db-deploy": "if [ ${taito_env} = 'local' ]; then docker exec ${taito_project}-server npx ts-node src/db/migrate.ts; else docker compose -f docker-compose-cicd.yaml run --rm ${taito_project}-server-cicd sh -c 'echo Sleeping... && sleep 30 && echo Done sleeping && npm run db-migrate'; fi",
    "taito-host-db-revert": "echo 'db revert not implemented'; exit 1;",
    "taito-host-db-rebase": "echo 'db rebase not implemented'; exit 1;",
```
