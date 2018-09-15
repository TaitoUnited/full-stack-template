import { asCamelCase } from '../common/format.util';

/**
 * Responsibilities of a db DAO:
 *
 * - Executes a database operation with the given parameters.
 * - Executes the database operation in the context of current transaction
 *   if transaction is present.
 * - Provides a set of fine-grained methods that services use to execute
 *   database operations.
 * - Each DAO should be responsible for only a small set of database tables
 *   (e.g 1-3). Create separate DAOs for such cases that a large
 *   multitable join is required (e.g. for searching and reporting).
 * - Consider using an ORM if your application is write-heavy
 *   (complex transactions that write to a large set of tables during the
 *   same transaction)
 */
async function fetch(db, criteria, count) {
  const columns = count
    ? 'count(*)::integer'
    : 'id, filename, description, author, type, created_at';

  const orderBy = count ? '' : 'ORDER BY created_at DESC';

  const paging = count ? '' : 'LIMIT $(limit) OFFSET $(offset)';

  const simpleTextClause = !criteria.simpleText
    ? ''
    : `
    AND (
       author ILIKE '%' || $(simpleText) || '%'
       OR filename ILIKE '%' || $(simpleText) || '%'
       OR description ILIKE '%' || $(simpleText) || '%'
       OR type ILIKE '%' || $(simpleText) || '%'
  )`;

  const posts = await db.any(
    `
     SELECT ${columns}
     FROM images
     WHERE (author = $(author) OR $(author) IS NULL)
       AND (type = $(type) OR $(type) IS NULL)
       ${simpleTextClause}
     ${orderBy}
     ${paging}
     `,
    {
      ...criteria,
      author: criteria.author || null,
      type: criteria.type || null,
    }
  );
  console.log(posts);
  return count ? posts[0].count : asCamelCase(posts);
}

async function create(db, image) {
  const data = await db.one(
    `
    INSERT INTO images
      (id, filename, description, author, type, created_at)
    VALUES
      (DEFAULT, $(filename), $(description), $(author), $(type), DEFAULT)
    RETURNING id
    `,
    { ...image }
  );
  return data.id;
}

async function read(db, id) {
  const image = await db.oneOrNone(
    `
    SELECT
      id, filename, description, author, type, created_at
    FROM images
    WHERE id = $(id)
    `,
    { id }
  );
  return asCamelCase(image);
}

async function update(db, image) {
  // TODO SQL INJECTION EXAMPLE!
  const data = await db.one(
    `
    UPDATE images
    SET
      filename=$(filename),
      description=$(description),
      author=$(author),
      type=$(type)
    WHERE id = $(id)
    RETURNING id
    `,
    { ...image }
  );
  return data.id;
}

async function patch(db, image) {
  // TODO
  console.log(JSON.stringify(image));
}

async function remove(db, id) {
  const data = await db.oneOrNone(
    `
    DELETE FROM images
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
