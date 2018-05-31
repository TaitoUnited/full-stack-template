import { asCamelCase } from '../common/format.util';

/**
 * Responsibilities of a 'DAO'
 *
 * - Executes a database operation with the given parameters.
 * - Executes the database operation in the context of current transaction
 *   if transaction is present.
 * - Provides a set of fine-grained methods that services use to execute
 *   database operations.
 * - Each DAO should be responsible for only a small set of database tables
 *   (e.g 1-3). Create separate SearchDAOs for such cases that a large
 *   multitable join is required (e.g. for searching and reporting).
 * - NOTE: Consider using an ORM if your application is write-heavy
 *   (complex transactions that write to a large set of tables during the
 *   same transaction)
 */

async function fetch(db, criteria, count) {
  const columns = count
    ? 'count(*)::integer'
    : 'id, subject, content, author, created_at';

  const orderBy = count ? '' : 'ORDER BY created_at DESC';

  const paging = count ? '' : 'LIMIT $(limit) OFFSET $(offset)';

  const simpleTextClause = !criteria.simpleText
    ? ''
    : `
      AND (
      author ILIKE '%' || $(simpleText) || '%'
      OR subject ILIKE '%' || $(simpleText) || '%'
      OR content ILIKE '%' || $(simpleText) || '%'
    )`;
  const posts = await db.any(
    `
    SELECT ${columns}
    FROM posts
    WHERE (author = $(author) OR $(author) IS NULL)
      ${simpleTextClause}
    ${orderBy}
    ${paging}
    `,
    {
      ...criteria,
      author: criteria.author || null,
    }
  );
  return count ? posts[0].count : asCamelCase(posts);
}

async function create(db, post) {
  const data = await db.one(
    `
    INSERT INTO posts (id, subject, content, author, created_at)
    VALUES (DEFAULT, $(subject), $(content), $(author), DEFAULT)
    RETURNING id
    `,
    { ...post }
  );
  return data.id;
}

async function read(db, id) {
  const post = await db.oneOrNone(
    `
    SELECT id, subject, content, author, created_at
    FROM posts
    WHERE id = $(id)
    `,
    { id }
  );
  return asCamelCase(post);
}

async function update(db, post) {
  // TODO SQL INJECTION EXAMPLE!
  const data = await db.one(
    `
    UPDATE posts
    SET
      subject=$(subject),
      content=$(content),
      author=$(author)
    WHERE id = $(id)
    RETURNING id
    `,
    { ...post }
  );
  return data.id;
}

async function patch(db, post) {
  // TODO
  console.log(JSON.stringify(post));
}

async function remove(db, id) {
  const data = await db.oneOrNone(
    `
    DELETE FROM posts
    WHERE id = $(id)
    RETURNING id
    `,
    { id }
  );
  return data.id;
}

export default {
  fetch,
  create,
  read,
  update,
  patch,
  remove,
};
