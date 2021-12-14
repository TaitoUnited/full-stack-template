import { Context } from 'koa';
import { UserRole } from '../types/context';

const authChecker = (ctx: Context, roles: UserRole[]) => {
  return !!ctx.state.appUser;
};

export default authChecker;
