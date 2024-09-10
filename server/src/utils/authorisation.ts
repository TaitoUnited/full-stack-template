import { type FastifyRequest } from 'fastify';

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function hasValidOrganisation(ctx: FastifyRequest['ctx']) {
  return ctx.organisationId
    ? ctx.userOrganisations.some((org) => org.id === ctx.organisationId)
    : false;
}

export function hasValidOrganisationRole(
  ctx: FastifyRequest['ctx'],
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
