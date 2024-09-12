import Boom from '@hapi/boom';
import { Context } from 'koa';
import { UserRole } from '../types/context';

/**
 * Checks if system-level operation is allowed.
 *
 * System-level operations are always allowed. This method is used just to
 * state that it is intentional that the service method does not contain
 * any user specific authorization logic.
 */
export function checkSystemPermission(state: Context['state']) {
  // At least one permissions check must have been run before a call is
  // made to a system-level service.
  // NOTE: This is here just in case to reveal programming errors.
  if (!state.permissionsChecked) {
    throw Boom.badImplementation('No user permissions have been checked!');
  }
}

/**
 * Checks if user is allowed to execute public operation.
 *
 * Public operations are always allowed. This method is used to just
 * state that it is intentional that the service method does not contain
 * any user specific authorization logic.
 */
export function checkPublicPermission(state: Context['state']) {
  // No need to check any user permissions for public functionality
  setPermissionsChecked(state);
}

/**
 * Sets a mark on state that some kind of permission check has been executed.
 * This is used in checkSystemPermission.
 */
export function setPermissionsChecked(state: Context['state']) {
  state.permissionsChecked = true;
}

/**
 * @Authorized() implementation for GraphQL resolvers. This is just an
 * additional pre-check that user has logged in. Actual authorization
 * is done in services.
 */
export const authChecker = (context: Context, roles: UserRole[]) => {
  // TODO: Implement auth here
  return true;
};

export default authChecker;
