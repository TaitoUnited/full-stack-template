import { AuthenticatedContext } from '~/setup/context';
import { throwApiError } from './error';
import { NonNullableField } from './types';

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type ContextWithOrganisation = NonNullableField<
  AuthenticatedContext,
  'organisationId'
>;

// check if user is member of the organisation specified in x-organisation-id header
export function checkOrganisationMembership(
  ctx: AuthenticatedContext
): asserts ctx is ContextWithOrganisation {
  if (!ctx.organisationId) {
    throwApiError({
      originApi: ctx.originApi,
      errorType: 'badRequest',
      message: 'Missing organisationId in request header',
    });
  }

  const isMember = ctx.organisationId
    ? ctx.userOrganisations.some((org) => org.id === ctx.organisationId)
    : false;
  if (!isMember) {
    throwApiError({
      originApi: ctx.originApi,
      errorType: 'forbidden',
      message: 'User is not member of given organisation',
    });
  }
}

export function hasValidOrganisationRole(
  ctx: AuthenticatedContext,
  ...roles: Role[]
) {
  const selectedOrganisation = ctx.userOrganisations.find(
    (org) => org.id === ctx.organisationId
  );

  if (!selectedOrganisation) {
    return false;
  }

  return roles.includes(selectedOrganisation.role);
}
