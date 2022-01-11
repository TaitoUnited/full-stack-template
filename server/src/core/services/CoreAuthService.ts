import { Context } from 'koa';
import { Service } from 'typedi';
import Boom from '@hapi/boom';
import { EntityType, Operation } from '../types/core';

@Service()
export class CoreAuthService {
  constructor() {}

  /**
   * Checks if system-level operation is allowed.
   */
  public async checkSystemPermission(state: Context['state']) {
    // At least one permissions check must have been run before a call is
    // made to a system-level service.
    if (!state.permissionsChecked) {
      throw Boom.badImplementation('No user permissions have been checked!');
    }
  }

  /**
   * Checks if user is allowed to execute public operation (always allowed).
   */
  public async checkPublicPermission(state: Context['state']) {
    // No need to check any user permissions for public functionality
    state.permissionsChecked = true;
  }

  /**
   * Checks if user is allowed to execute operation
   */
  public async checkPermission(
    state: Context['state'],
    entityType: EntityType,
    operation: Operation,
    entityId?: string
  ) {
    state.permissionsChecked = true;

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
  }
}
