import type { AuthenticatedContext, Context } from '~/setup/context';
import { checkOrganisationMembership } from '../utils/authorisation';
import { organisationDao } from './organisation.dao';

function getOrganisation(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);

  return organisationDao.getOrganisation(ctx.db, id);
}

function getUserOrganisations(ctx: AuthenticatedContext, userId: string) {
  return organisationDao.getUserOrganisations(ctx.db, userId);
}

function getUserOrganisationsWithRoles(ctx: Context, userId: string) {
  return organisationDao.getUserOrganisationsWithRoles(ctx.db, userId);
}

export const organisationService = {
  getOrganisation,
  getUserOrganisations,
  getUserOrganisationsWithRoles,
};
