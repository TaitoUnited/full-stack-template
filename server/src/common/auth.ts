import { Context } from 'koa';
import { UserRole } from './types';

const authChecker = (context: Context, roles: UserRole[]) => {
  // TODO: Implement auth here
  return true;
};

export default authChecker;
