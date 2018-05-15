import UserDAO from './user.dao';

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
export default class UserService {
  constructor(userDAO) {
    this.userDAO = userDAO || new UserDAO();
  }

  async fetch(state, criteria) {
    return this.userDAO.fetch(state.getTx(), criteria);
  }

  async create(state, user) {
    return this.userDAO.create(state.getTx(), user);
  }

  async read(state, id) {
    return this.userDAO.read(state.getTx(), id);
  }

  async update(state, user) {
    await this.userDAO.update(state.getTx(), user);
  }

  async patch(state, user) {
    await this.userDAO.patch(state.getTx(), user);
  }

  async remove(state, id) {
    await this.userDAO.remove(state.getTx(), id);
  }
}
