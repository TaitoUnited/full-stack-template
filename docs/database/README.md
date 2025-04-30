# Database

We use [PostgreSQL](https://www.postgresql.org/) as the database for the server
and [Drizzle](https://orm.drizzle.team/docs/overview) as the database management
tool and ORM / query builder.

The main database setup code is located in the `/db` folder. Here you can
find the database client setup, migrations, and seed data.

All the database tables are defined in each domain entity's `*.db.ts` file.
For example a table schema could be defined as follows for a `user` entity:

```typescript
import { pgTable, timestamp, text, boolean, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});
```

> ⚠️ **Note**:
> The schema files SHOULD NOT contain any runtime logic besides defining your DB schema.
> In particular, your DB connection should be defined separately.
> Otherwise, that logic will be executed whenever you run any drizzle-kit commands.

---

## Table of Contents

- [Migrations](./migration.md)
- [Operations](./operations.md)
- [Seeding](./seeding.md)

---

For detailed explanations on specific topics, refer to the individual documentation files linked above.
