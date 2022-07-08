import { Context } from 'koa';
import jwt from 'koa-jwt';

import { readSecret } from '../../common/setup/config';

export default async function jwtMiddleware(
  ctx: Context,
  next: () => Promise<void>
) {
  const secret = await readSecret('SESSION');

  if (!secret) {
    throw new Error('Session secrent not found');
  }

  const middleware = jwt({
    secret,
    passthrough: true,
    key: 'user',
    cookie: 'session',
  });

  return middleware(ctx, next);
}
