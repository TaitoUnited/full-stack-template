import { authorize, validate } from '../common/authorize.util.js';
import { roles } from '../common/common.constants.js';

import FileDAO from './file.dao';

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
export default class FileService {
  constructor(fileDAO) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.fileDAO = fileDAO || new FileDAO();
  }

  async fetch(ctx, criteria) {
    // TODO trace logging in methods!
    authorize(ctx).role(roles.dealer, roles.buyer);
    return await this.fileDAO.fetch(ctx.getTx(), criteria);
  }

  async create(ctx, file) {
    // authorize(ctx).role(roles.admin, roles.user);
    return await this.fileDAO.create(ctx.db, file);
  }

  async read(ctx, id) {
    return await this.fileDAO.read(ctx.getTx(), id);
  }

  async update(ctx, file) {
    // Write operation -> execute the operation inside a transaction
    return await ctx.tx(async tx => {
      await this._prepareUpdate(ctx, tx, file.id, file, true);
      await this.fileDAO.update(tx, file);
      // NOTE: You can also call another DAO or service inside the same
      // transaction, just pass the transaction as parameter
    });
  }

  async patch(ctx, file) {
    // Write operation -> execute the operation inside a transaction
    return await ctx.tx(async tx => {
      await this._prepareUpdate(ctx, tx, file.id, file, true);
      await this.fileDAO.patch(tx, file);
      // NOTE: You can also call another DAO or service inside the same
      // transaction, just pass the transaction as parameter
    });
  }

  async remove(ctx, id) {
    // Write operation -> execute the operation inside a transaction
    return await ctx.tx(async tx => {
      await this._prepareUpdate(ctx, tx, id, null, false);
      await this.fileDAO.removeByFileId(tx, id);
      // NOTE: You can also call another DAO or service inside the same
      // transaction, just pass the transaction as parameter
    });
  }

  // Validate and authorize file update
  async _prepareUpdate(ctx, tx, fileId, file, shouldAlreadyExist) {
    let oldFile = null;

    // Check that file exists
    if (shouldAlreadyExist) {
      oldFile = await this.fileDAO.fetch(tx, fileId);
      validate('oldFile', oldFile).found();
    }

    // Check that user has rights
    authorize(ctx)
      .role(roles.dealer)
      .department(file.department);
    if (oldFile) {
      authorize(ctx).equals('department', file.department, oldFile.department);
    }
  }
}
