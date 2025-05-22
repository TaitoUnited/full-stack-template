import { AuthenticatedContext, Context } from '~/setup/context';
import { checkOrganisationMembership } from '../utils/authorisation';
import { organisationService } from './organisation.service';

async function getOrganisation(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);

  return await organisationService.getOrganisation(ctx.db, id);
}

async function getUserOrganisations(ctx: AuthenticatedContext, userId: string) {
  return await organisationService.getUserOrganisations(ctx.db, userId);
}

async function getUserOrganisationsWithRoles(ctx: Context, userId: string) {
  return await organisationService.getUserOrganisationsWithRoles(
    ctx.db,
    userId
  );
}

export const organisationController = {
  getOrganisation,
  getUserOrganisations,
  getUserOrganisationsWithRoles,
};
