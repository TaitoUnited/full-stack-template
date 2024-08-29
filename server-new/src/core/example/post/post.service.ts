import { eq, ilike } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { GraphQLError } from '~/common/error';
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
  const [post] = await db.select().from(postTable).where(eq(postTable.id, id));
  return post;
}

export async function createPost(
  db: DrizzleDb,
  values: { title: string; content: string; authorId: string }
) {
  const [post] = await db.insert(postTable).values(values).returning();
  if (!post) throw GraphQLError.internal();
  return post;
}
