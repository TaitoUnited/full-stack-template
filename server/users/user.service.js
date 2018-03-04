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

  async fetch(state, criteria) {
    return this.userDAO.fetch(state.getTx(), criteria);
  }

  async create(state, user) {
    return this.userDAO.create(state.db, user);
  }

  async read(state, id) {
    return this.userDAO.read(state.getTx(), id);
  }

  async update(state, user) {
    // Write operation -> execute the operation inside a transaction
    return state.tx(async tx => {
      await this.userDAO.update(tx, user);
    });
  }

  async patch(state, user) {
    // Write operation -> execute the operation inside a transaction
    return state.tx(async tx => {
      await this.userDAO.patch(tx, user);
    });
  }

  async remove(state, id) {
    // Write operation -> execute the operation inside a transaction
    return state.tx(async tx => {
      await this.userDAO.remove(tx, id);
    });
  }
}
