import authorize from '../common/authorize.util.js';
import db from './db';

/**
 * Responsibilities of a service:
 *
 * - Authorizes that the user has a right to execute the operation with the
 *   given parameters.
 * - Validates the given parameters (NOTE: only for such part that is not
 *   handled by schema validation tools like joi or swagger)
 * - Executes the operation with the help of fine-grained DAOs and other
 *   services.
 * - Does not operate on http request and response directly.
 * - Throws an exception in case of an error.
 *
 * NOTE: In a really simple application you may combine router, service and dao
 * into one class in which you parse request, authorize, validate,
 * execute database operation and generate response with a single method.
 */

export default class PostService {
  constructor(postDB) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.postDB = postDB || db;
  }

  async fetch(state, criteria) {
    // TODO enable authorize once proper sign in has been implemented
    // authorize(state).role('admin', 'user');
    return {
      totalCount: await this.postDB.fetch(state.getTx(), criteria, true),
      data: await this.postDB.fetch(state.getTx(), criteria),
    };
  }

  async create(state, post) {
    // TODO enable authorize once proper sign in has been implemented
    // authorize(state).role('admin', 'user');
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
