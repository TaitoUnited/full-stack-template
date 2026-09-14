import type { AuthenticatedContext } from '~/setup/context';
import { organisationDao } from './organisation.dao';

function getOrganisation(ctx: AuthenticatedContext, id: string) {
  return organisationDao.getOrganisation(ctx.db, { id, userId: ctx.user.id });
}

function getUserOrganisations(ctx: AuthenticatedContext) {
  return organisationDao.getUserOrganisations(ctx.db, ctx.user.id);
}

export const organisationService = {
  getOrganisation,
  getUserOrganisations,
};
