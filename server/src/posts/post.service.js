import PostDAO from './post.dao';

/**
 * Responsibilities of a service:
 *
 * - Validates the given parameters.
 * - Authorizes that the user has a right to execute the operation with the
 *   given parameters.
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
    return this.postDAO.create(state.getTx(), post);
  }

  async read(state, id) {
    return this.postDAO.read(state.getTx(), id);
  }

  async update(state, post) {
    await this.postDAO.update(state.getTx(), post);
  }

  async patch(state, post) {
    await this.postDAO.patch(state.getTx(), post);
  }

  async remove(state, id) {
    await this.postDAO.remove(state.getTx(), id);
  }
}
