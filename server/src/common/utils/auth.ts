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
export async function checkSystemPermission(state: Context['state']) {
  // No permissions to check
}

/**
 * Checks if user is allowed to execute public operation.
 *
 * Public operations are always allowed. This method is used to just
 * state that it is intentional that the service method does not contain
 * any user specific authorization logic.
 */
export async function checkPublicPermission(state: Context['state']) {
  // No permissions to check
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
