import { AuthenticatedContext } from '~/setup/context';
import { checkOrganisationMembership } from '../utils/authorisation';
import { userService } from './user.service';
import { GraphQlContext } from '~/setup/graphql/server';

async function getOrgUsers(ctx: AuthenticatedContext) {
  checkOrganisationMembership(ctx);

  return await userService.getOrgUsers(ctx.db, {
    organisationId: ctx.organisationId,
  });
}

async function getOrgUser(
  ctx: AuthenticatedContext,
  id: string | null | undefined
) {
  if (!id) return null;

  checkOrganisationMembership(ctx);

  return await userService.getOrgUser(ctx.db, {
    id,
    organisationId: ctx.organisationId,
  });
}

async function getUser(ctx: GraphQlContext, id: string) {
  return await userService.getUser(ctx.db, id);
}

function getUserByEmail(ctx: GraphQlContext, email: string) {
  return userService.getUserByEmail(ctx.db, email);
}

function updateUserLastLogin(ctx: GraphQlContext, userId: string) {
  return userService.updateUserLastLogin(ctx.db, userId);
}

export const userController = {
  getOrgUsers,
  getOrgUser,
  getUser,
  getUserByEmail,
  updateUserLastLogin,
};
