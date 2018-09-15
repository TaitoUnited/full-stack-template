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
export default class ImageService {
  constructor(imageDB) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.imageDB = imageDB || db;
  }

  async fetch(state, criteria) {
    authorize(state).role('admin', 'user');
    return {
      totalCount: await this.imageDB.fetch(state.getTx(), criteria, true),
      data: await this.imageDB.fetch(state.getTx(), criteria),
    };
  }

  async create(state, image) {
    authorize(state).role('admin', 'user');
    const id = await this.imageDB.create(state.getTx(), image);
    return this.imageDB.read(state.getTx(), id);
  }

  async read(state, id) {
    authorize(state).role('admin', 'user');
    return this.imageDB.read(state.getTx(), id);
  }

  async update(state, image) {
    authorize(state).role('admin');
    await this.imageDB.update(state.getTx(), image);
  }

  async patch(state, image) {
    authorize(state).role('admin');
    await this.imageDB.patch(state.getTx(), image);
  }

  async remove(state, id) {
    authorize(state).role('admin');
    await this.imageDB.remove(state.getTx(), id);
  }
}
