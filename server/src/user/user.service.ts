import { AuthenticatedContext } from '~/setup/context';
import { GraphQlContext } from '~/setup/graphql/types';
import { checkOrganisationMembership } from '../utils/authorisation';
import { userDao } from './user.dao';

async function getOrgUsers(ctx: AuthenticatedContext) {
  checkOrganisationMembership(ctx);

  return userDao.getOrgUsers(ctx.db, {
    organisationId: ctx.organisationId,
  });
}

async function getOrgUser(
  ctx: AuthenticatedContext,
  id: string | null | undefined
) {
  if (!id) return null;

  checkOrganisationMembership(ctx);

  return userDao.getOrgUser(ctx.db, {
    id,
    organisationId: ctx.organisationId,
  });
}

async function getUser(ctx: GraphQlContext, id: string) {
  return userDao.getUser(ctx.db, id);
}

function getUserByEmail(ctx: GraphQlContext, email: string) {
  return userDao.getUserByEmail(ctx.db, email);
}

function updateUserLastLogin(ctx: GraphQlContext, userId: string) {
  return userDao.updateUserLastLogin(ctx.db, userId);
}

export const userService = {
  getOrgUsers,
  getOrgUser,
  getUser,
  getUserByEmail,
  updateUserLastLogin,
};
