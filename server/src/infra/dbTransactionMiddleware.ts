import { Context } from 'koa';
import { txMode } from 'pg-promise';

const noTransactionPaths = ['/healthz'];

const readOnlyMode = new txMode.TransactionMode({
  readOnly: true,
});

const readWriteMode = new txMode.TransactionMode({
  /* Defaults */
});

export default async function dbTransactionMiddleware(
  ctx: Context,
  next: () => Promise<void>
) {
  const mode = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(ctx.request.method)
    ? readWriteMode
    : readOnlyMode;

  if (noTransactionPaths.includes(ctx.request.path)) {
    await next();
  } else {
    await ctx.state.db.tx({ mode }, async (tx: any) => {
      ctx.state.tx = tx;
      await next();
    });
  }
}
