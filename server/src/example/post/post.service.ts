import { and, eq, ilike, desc } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { postTable } from './post.db';

export async function getPosts(
  db: DrizzleDb,
  params: {
    organisationId?: string | null;
    search?: string | null;
  }
) {
  const organisationCondition = params.organisationId
    ? eq(postTable.organisationId, params.organisationId)
    : undefined;

  const searchCondition = params.search
    ? ilike(postTable.title, `%${params.search}%`)
    : undefined;

  return db
    .select()
    .from(postTable)
    .where(and(organisationCondition, searchCondition))
    .orderBy(desc(postTable.createdAt));
}

export async function getPost(
  db: DrizzleDb,
  params: { id: string; organisationId?: string | null }
) {
  const organisationCondition = params.organisationId
    ? eq(postTable.organisationId, params.organisationId)
    : undefined;

  return db
    .select()
    .from(postTable)
    .where(and(eq(postTable.id, params.id), organisationCondition))
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
