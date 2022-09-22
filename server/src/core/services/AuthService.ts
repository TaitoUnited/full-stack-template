import Boom from '@hapi/boom';
import { Context } from 'koa';
import { Service } from 'typedi';

import {
  checkSystemPermission,
  checkPublicPermission,
  setPermissionsChecked,
} from '../../common/utils/auth';

import { EntityType, Operation } from '../../common/types/entity';

type HasPermissionInput = {
  state: Context['state'];
  entityType: EntityType;
  operation: Operation;
  // Additional parameters for permission check:
  // accountId: string
};
type CheckPermissionInput = HasPermissionInput;

/**
 * Common service for authorization
 */
@Service()
export class AuthService {
  /**
   * Checks if system-level operation is allowed.
   *
   * System-level operations are always allowed. This method is used just to
   * state that it is intentional that the service method does not contain
   * any user specific authorization logic.
   */
  public checkSystemPermission(state: Context['state']) {
    checkSystemPermission(state);
  }

  /**
   * Checks if user is allowed to execute public operation.
   *
   * Public operations are always allowed. This method is used to just
   * state that it is intentional that the service method does not contain
   * any user specific authorization logic.
   */
  public checkPublicPermission(state: Context['state']) {
    checkPublicPermission(state);
  }

  /**
   * Throws Boom.forbidden if user is not allowed to execute
   * the operation.
   */
  public checkPermission(input: CheckPermissionInput) {
    setPermissionsChecked(input.state);

    if (!this.hasPermission(input)) {
      throw Boom.forbidden(
        `Operation ${input.operation} on entity ${input.entityType} not allowed.`
      );
    }
  }

  /**
   * Returns false if user is not allowed to execute the operation.
   */
  public hasPermission(input: HasPermissionInput) {
    setPermissionsChecked(input.state);

    // TODO: Check that authentication credentials are present
    // and user has permissions for the operation.

    // NOTE: You should aim for non-async implementation by storing user
    // permissions to state on authMiddleware (e.g. users role for each
    // account, or something like that) and passing additional info
    // about the entity in question for the hasPermission/checkPermission
    // method (by reading them from database before the call). This way
    // the AuthService serves as a pure permission rule engine with no
    // dependencies to services and daos of the app.
    //
    // However, if non-async implementation doesn't suit you, you can
    // change this into a async implementation and cache permission checks
    // on http request state. But beware! Use extra care that you don't
    // forget that `await` before each checkPermission call!

    return true;
  }
}
