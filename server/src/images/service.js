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
