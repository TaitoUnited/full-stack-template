import data from './post.data';

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
 *   (e.g 1-3). Create separate search DAOs for such cases that a large
 *   multitable join is required (e.g. for searching and reporting).
 * - NOTE: Consider using an ORM if your application is write-heavy
 *   (complex transactions that write to a large set of tables during the
 *   same transaction)
 */
export default class TagDAO {
  async fetch(db, criteria) {
    // NOTE: not implemented
    console.log(`SEARCH CRITERIA: ${JSON.stringify(criteria)}`);
    return {
      data: data.tags,
      totalCount: data.tags.length,
    };
  }
}
