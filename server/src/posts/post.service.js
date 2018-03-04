import PostDAO from './post.dao';

/**
 * Responsibilities of a service:
 *
 * - Validates the given parameters.
 * - Authorizes that the user has a right to execute the operation with the
 *   given parameters.
 * - For write operations ensures that there is a transaction present
 *   (most write operation should be atomic).
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
  constructor(postDAO) {
    this.postDAO = postDAO || new PostDAO();
  }

  async fetch(state, criteria) {
    return this.postDAO.fetch(state.getTx(), criteria);
  }

  async create(state, post) {
    return this.postDAO.create(state.db, post);
  }

  async read(state, id) {
    return this.postDAO.read(state.getTx(), id);
  }

  async update(state, post) {
    // Write operation -> execute the operation inside a transaction
    return state.tx(async tx => {
      await this.postDAO.update(tx, post);
    });
  }

  async patch(state, post) {
    // Write operation -> execute the operation inside a transaction
    return state.tx(async tx => {
      await this.postDAO.patch(tx, post);
    });
  }

  async remove(state, id) {
    // Write operation -> execute the operation inside a transaction
    return state.tx(async tx => {
      await this.postDAO.remove(tx, id);
    });
  }
}
