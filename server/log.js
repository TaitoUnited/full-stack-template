import bunyan from 'bunyan';
import _ from 'lodash';

import config from './config';
import ns from './cls';

const severityByBunyanLevel = {
  [bunyan.TRACE]: 'DEBUG',
  [bunyan.DEBUG]: 'DEBUG',
  [bunyan.INFO]: 'INFO',
  [bunyan.WARN]: 'WARNING',
  [bunyan.ERROR]: 'ERROR',
  [bunyan.FATAL]: 'CRITICAL',
};

// https://cloud.google.com/error-reporting/docs/formatting-error-messages
class StackdriverStream {
  constructor(stream) {
    this.stream = stream;
  }
  write(e) {
    const formatted = {
      severity: severityByBunyanLevel[e.level],
      message: (e.msg || '') +
        (e.err ? ` ${e.err.msg}: ${e.err.stack}` : ''),
      context: {
        httpRequest: !e.req ? undefined : {
          method: e.req.method,
          url: e.req.url,
          responseStatusCode: e.res ? e.res.statusCode : undefined,
          userAgent: e.req.headers['user-agent'],
          referrer: e.req.headers.referer,
          remoteIp: e.req.headers['x-real-ip'],
        },
        user: 'TODO',
        reportLocation: {
          filePath: 'TODO',
          lineNumber: 0,
          functionName: 'TODO',
        },
      },
      eventTime: e.time,
      serviceContext: {
        service: e.name,
        version: config.APP_VERSION,
      },
    };
    this.stream.write(JSON.stringify(formatted));
    this.stream.write('\n');
  }
}

const logger = bunyan.createLogger({
  name: config.APP_NAME,
  serializers: bunyan.stdSerializers,
  level: config.DEBUG ? 'trace' : 'info',
  streams: [
    {
      type: 'raw',
      stream: new StackdriverStream(process.stderr),
      level: 'warn',
    },
    {
      type: 'raw',
      stream: new StackdriverStream(process.stdout),
      level: 'info',
    },
  ],
});

logger.info(
  `Bunyan logger created. Debugging is set to ${config.DEBUG}. ` +
  `Log level is set to '${severityByBunyanLevel[logger.level()]}'.`
);

function _addCtxToLog(args) {
  const reqId = ns.get('req_id');
  const logCtx = ns.get('logCtx');

  const head = args[0];
  let newHead = { req_id: reqId, ...logCtx };
  let tail;

  if (_.isPlainObject(head)) {
    newHead = { ...head, ...newHead };
    tail = args.slice(1);
  } else {
    tail = args;
  }

  return [newHead].concat(tail); // newArgs
}

function mergeToCtx(obj) {
  const cur = ns.get('logCtx');
  ns.set('logCtx', { ...cur, ...obj });
}

const log = {};
log.trace = (...args) => logger.trace(..._addCtxToLog(args));
log.debug = (...args) => logger.debug(..._addCtxToLog(args));
log.info = (...args) => logger.info(..._addCtxToLog(args));
log.warn = (...args) => logger.warn(..._addCtxToLog(args));
log.error = (...args) => logger.error(..._addCtxToLog(args));
log.fatal = (...args) => logger.fatal(..._addCtxToLog(args));

export default log;
export { mergeToCtx };
