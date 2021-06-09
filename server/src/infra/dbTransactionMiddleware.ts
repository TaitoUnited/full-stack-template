import { Context, Request } from 'koa';
import { txMode } from 'pg-promise';

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
  const mode = requiresWriteMode(ctx.request) ? readWriteMode : readOnlyMode;

  if (noTransactionPaths.includes(ctx.request.path)) {
    await next();
  } else {
    await ctx.state.db.tx({ mode }, async (tx: any) => {
      ctx.state.tx = tx;
      await next();
    });
  }
}
