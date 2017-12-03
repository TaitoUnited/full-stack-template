/* eslint-disable class-methods-use-this */
// --> TODO: Convert to object?

/**
 * Responsibilities of a DAO:
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
export default class FileDAO {
  async fetch(db, criteria) {
    console.log(`SEARCH CRITERIA: ${JSON.stringify(criteria)}`);
    const params = {
      name: criteria.name
    };
    return await db
      .any(
        `
      SELECT json_build_object(
        'id', c.id,
        'name', c.name,
        'description', c.description
      )
      FROM example_file AS c
      WHERE (c.name = $[name] OR $[name] IS NULL)
      ORDER BY c.id, c.name
    `,
        params
      )
      .then(rows => {
        return rows.map(row => row.json_build_object);
      });
  }

  async create(db, file) {
    return await db.one(
      `
      INSERT INTO example_file (name, description)
      VALUES ($[name], $[description])
      RETURNING id`,
      file
    );
  }

  async read(db, id) {
    return db.any(
      `
      SELECT json_build_object(
        'id', c.id,
        'name', c.name,
        'description', c.description
      )
      FROM example_file AS u
      WHERE id = $[id]
    `,
      { id }
    );
  }

  async update(db, file) {
    // TODO SQL INJECTION EXAMPLE!
    console.log(JSON.stringify(file));
  }

  async patch(db, file) {
    // TODO
    console.log(JSON.stringify(file));
  }

  async delete(db, file) {
    // TODO
    console.log(JSON.stringify(file));
  }
}
