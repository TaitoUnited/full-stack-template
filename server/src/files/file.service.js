import authorize from '../common/authorize.util.js';
import validate from '../common/validate.util.js';
import { rolesById } from '../common/common.constants.js';

import FileDAO from './file.dao';

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
export default class FileService {
  constructor(fileDAO) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.fileDAO = fileDAO || new FileDAO();
  }

  async fetch(state, criteria) {
    // TODO trace logging in methods!
    authorize(state).role(rolesById.dealer, rolesById.buyer);
    return this.fileDAO.fetch(state.getTx(), criteria);
  }

  async create(state, file) {
    // authorize(state).role(roles.admin, roles.user);
    return this.fileDAO.create(state.getTx(), file);
  }

  async read(state, id) {
    return this.fileDAO.read(state.getTx(), id);
  }

  async update(state, file) {
    await this._prepareUpdate(state, state.getTx(), file.id, file, true);
    await this.fileDAO.update(state.getTx(), file);
    // NOTE: You can also call another DAO or service inside the same
    // transaction, just pass the transaction as parameter
  }

  async patch(state, file) {
    await this._prepareUpdate(state, state.getTx(), file.id, file, true);
    await this.fileDAO.patch(state.getTx(), file);
    // NOTE: You can also call another DAO or service inside the same
    // transaction, just pass the transaction as parameter
  }

  async remove(state, id) {
    await this._prepareUpdate(state, state.getTx(), id, null, false);
    await this.fileDAO.removeByFileId(state.getTx(), id);
    // NOTE: You can also call another DAO or service inside the same
    // transaction, just pass the transaction as parameter
  }

  // Validate and authorize file update
  async _prepareUpdate(state, tx, fileId, file, shouldAlreadyExist) {
    let oldFile = null;

    // Check that file exists
    if (shouldAlreadyExist) {
      oldFile = await this.fileDAO.fetch(state.getTx(), fileId);
      validate('oldFile', oldFile).found();
    }

    // Check that user has rights
    authorize(state)
      .role(rolesById.dealer)
      .department(file.department);
    if (oldFile) {
      authorize(state).equals(
        'department',
        file.department,
        oldFile.department
      );
    }
  }
}
