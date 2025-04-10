# Migrations

When you need to make changes to the database schema, you need to first modify
the table schema in the `/src/<domain-name>/<entity>.db.ts` file.
Then you can create a new migration file by running the following command:

```sh
npm run db:migrate:generate
```

This will create a new migration file in the `/db/migrations` folder.
With the server running in the background, you can then run the migration
with the following command:

```sh
taito exec:server npm run db:migrate
```

If you realise that the migration is incorrect, you can drop the migration with:

```sh
npm run db:migrate:drop
```

But note that if you already ran the migration, you need to manually revert the
migration changes from the database. Drizzle doesn't currently support migration
[rollbacks](https://github.com/drizzle-team/drizzle-orm/discussions/1339).

One option is to recreate the database by running:

```sh
taito db recreate
```

And then you can run the existing migrations and seed data again to get the database
back to the state before the incorrect migration. See the next section for more
information about seeding data.

The CI/CD tool will deploy your database changes automatically to servers once you push your changes to git.

You can read more about how to do migrations with Drizzle in their [docs](https://orm.drizzle.team/docs/migrations).

## Database dumps

If your seeders are not comprehensive enough you might want to take a database
dump before running any migrations. This way you can easily restore the database
to the previous state if something goes wrong.

You can use `taito-cli` to take a database dump:

```sh
# Take a database dump
taito db dump dump.sql -- --data-only

# Import the database dump back to the database
taito db import:dev dump.sql
```
