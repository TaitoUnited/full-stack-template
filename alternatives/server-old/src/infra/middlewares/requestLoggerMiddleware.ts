import { Context } from 'koa';
import { v4 as uuidv4 } from 'uuid';

// Every time an instance of this is logged by bunyan it outputs
// the time since the beginning of the request (instance creation)
class RequestTimer {
  private start = Date.now();

  public toJSON = () => {
    return Date.now() - this.start;
  };
}

const noLogPaths = ['/healthz', '/uptimez'];

export default async function requestLoggerMiddleware(
  ctx: Context,
  next: () => Promise<void>
) {
  const { headers } = ctx.request;

  let requestId = headers['request-id'] || headers['x-request-id'];
  if (!requestId) {
    // No request ID found in headers, so generate our own.
    requestId = uuidv4();
  }

  const requestMs = new RequestTimer();
  const requestLog = ctx.state.log.child({ requestId, requestMs }, true);
  ctx.state.log = requestLog;

  const logRequest = !noLogPaths.includes(ctx.request.path);

  await next();

  if (logRequest) {
    requestLog.info(
      { req: ctx.req, res: ctx.res, latency: requestMs },
      'Request handled'
    );
  }
}
