# Seed data

Seeding meaningful data to the database is important for development and testing.

You can implement seeders in the `/db/seed` folder where it is recommended to
create a seeder for each domain entity as the seeding logic can end up quite long
and verbose.

Each seeder file should export a `seed` function that is then imported and used
in the main seed file `/db/seed/index.ts`.

For example, a seeder for the `user` entity could look like this:

```typescript
import { type DrizzleDb } from "../index";

export async function seed(db: DrizzleDb) {
  const user1 = await createUser(db, {
    email: "john@doe.com",
    name: "John Doe",
  });

  const user2 = await createUser(db, {
    email: "jane@moe.com",
    name: "Jane Moe",
  });

  return { user1, user2 };
}

function createUser(db: DrizzleDb, user: { email: string; name: string }) {
  // Use Drizzle ORM to create a new user
}
```
