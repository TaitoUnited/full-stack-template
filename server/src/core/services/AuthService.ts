import Boom from '@hapi/boom';
import { Context } from 'koa';
import { Service } from 'typedi';

import {
  checkSystemPermission,
  checkPublicPermission,
  setPermissionsChecked,
} from '../../common/utils/auth';

import { EntityType, Operation } from '../../common/types/entity';

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
  public async checkSystemPermission(state: Context['state']) {
    checkSystemPermission(state);
  }

  /**
   * Checks if user is allowed to execute public operation.
   *
   * Public operations are always allowed. This method is used to just
   * state that it is intentional that the service method does not contain
   * any user specific authorization logic.
   */
  public async checkPublicPermission(state: Context['state']) {
    checkPublicPermission(state);
  }

  /**
   * Checks if user is allowed to execute operation
   */
  // TODO: make args into one object instead of passing them as separate args
  public async checkPermission(
    state: Context['state'],
    entityType: EntityType,
    operation: Operation,
    entityId?: string
  ) {
    setPermissionsChecked(state);

    // Check that entity id was given in case it's mandatory
    if (
      !entityId &&
      operation !== Operation.LIST &&
      operation !== Operation.ADD
    ) {
      throw Boom.badImplementation('Entity id must be given.');
    }

    // TODO: Check that authentication credentials are present

    // TODO: Check user permissions and throw Boom.forbidden() if forbidden

    // NOTE: You should cache checked user permissions during serving a single
    // http request so that you don't need to check the same permission from
    // database over and over again in case of a deep GraphQL query.
  }
}
