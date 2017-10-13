import UserDAO from './user.dao';

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
export default class UserService {

  constructor(userDAO) {
    this.userDAO = userDAO || new UserDAO();
  }

  async read(ctx, id) {
    return await this.userDAO.read(ctx.getTx(), id);
  }

}
