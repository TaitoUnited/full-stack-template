import { AuthenticatedContext, Context } from '~/setup/context';
import { checkOrganisationMembership } from '../utils/authorisation';
import { organisationDao } from './organisation.dao';

async function getOrganisation(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);

  return await organisationDao.getOrganisation(ctx.db, id);
}

async function getUserOrganisations(ctx: AuthenticatedContext, userId: string) {
  return await organisationDao.getUserOrganisations(ctx.db, userId);
}

async function getUserOrganisationsWithRoles(ctx: Context, userId: string) {
  return await organisationDao.getUserOrganisationsWithRoles(ctx.db, userId);
}

export const organisationService = {
  getOrganisation,
  getUserOrganisations,
  getUserOrganisationsWithRoles,
};
