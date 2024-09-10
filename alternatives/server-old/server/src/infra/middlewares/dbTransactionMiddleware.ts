import { Context, Request } from 'koa';
import { txMode } from 'pg-promise';
import { Cache } from '../../common/types/cache';

const noTransactionPaths = ['/healthz'];

const readOnlyMode = new txMode.TransactionMode({
  readOnly: true,
});

const readWriteMode = new txMode.TransactionMode({
  /* Defaults */
});

const isGraphQLQuery = (request: Request) => {
  return (
    request.url === '/' &&
    ((request.body as Record<string, any>)?.query || '').startsWith('query ')
  );
};

const requiresWriteMode = (request: Request) => {
  return (
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) &&
    !isGraphQLQuery(request)
  );
};

export default async function dbTransactionMiddleware(
  ctx: Context,
  next: () => Promise<void>
) {
  const writeModeEnabled = requiresWriteMode(ctx.request);
  const mode = writeModeEnabled ? readWriteMode : readOnlyMode;

  // Init caching based on transaction mode
  ctx.state.cache = {
    enabled: !writeModeEnabled,
    data: {},
  } as Cache;

  if (noTransactionPaths.includes(ctx.request.path)) {
    await next();
  } else {
    await ctx.state._db.tx({ mode }, async (tx: any) => {
      ctx.state.tx = tx;
      await next();
    });
  }
}
