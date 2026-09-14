import type { GraphQlContext } from '~/setup/graphql/types';
import { userDao } from './user.dao';

function getUser(ctx: GraphQlContext, id: string) {
  return userDao.getUser(ctx.db, id);
}

function getUserByEmail(ctx: GraphQlContext, email: string) {
  return userDao.getUserByEmail(ctx.db, email);
}

function updateUserLastLogin(ctx: GraphQlContext, userId: string) {
  return userDao.updateUserLastLogin(ctx.db, userId);
}

export const userService = {
  getUser,
  getUserByEmail,
  updateUserLastLogin,
};
