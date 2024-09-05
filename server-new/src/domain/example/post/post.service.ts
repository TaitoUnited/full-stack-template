import { eq, ilike } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { postTable } from './post.db';

export async function getPosts(
  db: DrizzleDb,
  params: { search?: string | null }
) {
  return db
    .select()
    .from(postTable)
    .where(
      params.search ? ilike(postTable.title, `%${params.search}%`) : undefined
    );
}

export async function getPost(db: DrizzleDb, id: string) {
  return db
    .select()
    .from(postTable)
    .where(eq(postTable.id, id))
    .then((rows) => rows[0]);
}

export async function createPost(
  db: DrizzleDb,
  values: {
    title: string;
    content: string;
    authorId: string;
    organisationId: string;
  }
) {
  return db
    .insert(postTable)
    .values(values)
    .returning()
    .then((rows) => rows[0]!);
}
