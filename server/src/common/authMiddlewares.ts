import Boom from 'boom';
import { ParameterizedContext } from 'koa';
import koaBasicAuth from 'koa-basic-auth';

export function createCheckBasicAuthMiddleware(
  username: string,
  password: string
) {
  return koaBasicAuth({ name: username, pass: password });
}

export async function requireAdminMiddleware(
  ctx: ParameterizedContext,
  next: () => Promise<any>
) {
  const { isAdmin, userId } = ctx.session as any;

  if (!isAdmin && userId) {
    throw Boom.forbidden();
  }

  if (!isAdmin) {
    throw Boom.unauthorized();
  }

  await next();
}

export function createCheckBasicAuthOrRequireAdminMiddleware(
  username: string,
  password: string
) {
  const basicAuth = createCheckBasicAuthMiddleware(username, password);
  return async function middleware(
    ctx: ParameterizedContext,
    next: () => Promise<any>
  ) {
    try {
      await basicAuth(ctx, next);
    } catch (err) {
      if (err.status !== 401) {
        throw err;
      }
      await requireAdminMiddleware(ctx, next);
    }
  };
}
