import authorize from '../common/authorize.util.js';
import db from './db';

/**
 * Responsibilities of a service:
 *
 * - Authorizes that the user has a right to execute the operation with the
 *   given parameters.
 * - Validates the given parameters in the context of the operation
 *   (json schema validation occurs in middleware, not here)
 * - Executes the operation with the help of fine-grained DAOs and other
 *   services.
 * - Should not operate on http request and response directly
 *   (only in special circumstances)
 * - Throws an exception in case of an error.
 */
export default class PostService {
  constructor(postDB) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.postDB = postDB || db;
  }

  async fetch(state, criteria) {
    authorize(state).role('admin', 'user');
    return {
      totalCount: await this.postDB.fetch(state.getTx(), criteria, true),
      data: await this.postDB.fetch(state.getTx(), criteria),
    };
  }

  async create(state, post) {
    authorize(state).role('admin', 'user');
    const id = await this.postDB.create(state.getTx(), post);
    return this.postDB.read(state.getTx(), id);
  }

  async read(state, id) {
    authorize(state).role('admin', 'user');
    return this.postDB.read(state.getTx(), id);
  }

  async update(state, post) {
    authorize(state).role('admin');
    await this.postDB.update(state.getTx(), post);
  }

  async patch(state, post) {
    authorize(state).role('admin');
    await this.postDB.patch(state.getTx(), post);
  }

  async remove(state, id) {
    authorize(state).role('admin');
    await this.postDB.remove(state.getTx(), id);
  }
}
