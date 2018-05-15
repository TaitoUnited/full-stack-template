import CommentDAO from './comment.dao';

/**
 * Responsibilities of a service:
 *
 * - Authorizes that the user has a right to execute the operation with the
 *   given parameters.
 * - Validates the given parameters (NOTE: only for such part that is not
 *   handled by schema validation tools like joi or swagger)
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
export default class CommentService {
  constructor(commentDAO) {
    this.commentDAO = commentDAO || new CommentDAO();
  }

  async fetch(state, criteria) {
    return this.commentDAO.fetch(state.getTx(), criteria);
  }
}
