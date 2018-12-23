import { asCamelCase } from '../common/format.util';

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
     FROM files
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

async function create(db, file) {
  const data = await db.one(
    `
    INSERT INTO files
      (id, filename, description, author, type, created_at)
    VALUES
      (DEFAULT, $(filename), $(description), $(author), $(type), DEFAULT)
    RETURNING id
    `,
    { ...file }
  );
  return data.id;
}

async function read(db, id) {
  const file = await db.oneOrNone(
    `
    SELECT
      id, filename, description, author, type, created_at
    FROM files
    WHERE id = $(id)
    `,
    { id }
  );
  return asCamelCase(file);
}

async function update(db, file) {
  // TODO SQL INJECTION EXAMPLE!
  const data = await db.one(
    `
    UPDATE files
    SET
      filename=$(filename),
      description=$(description),
      author=$(author),
      type=$(type)
    WHERE id = $(id)
    RETURNING id
    `,
    { ...file }
  );
  return data.id;
}

async function patch(db, file) {
  // TODO
  console.log(JSON.stringify(file));
}

async function remove(db, id) {
  const data = await db.oneOrNone(
    `
    DELETE FROM files
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
