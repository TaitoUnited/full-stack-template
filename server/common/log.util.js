import bunyan from 'bunyan';
import _ from 'lodash';
import { createNamespace } from 'continuation-local-storage';

import config from './common.config';

const namespace = createNamespace('fi.server-template');

const stackdriverSeverityByBunyanLevel = {
  [bunyan.TRACE]: 'DEBUG',
  [bunyan.DEBUG]: 'DEBUG',
  [bunyan.INFO]: 'INFO',
  [bunyan.WARN]: 'WARNING',
  [bunyan.ERROR]: 'ERROR',
  [bunyan.FATAL]: 'CRITICAL'
};

const logHeaders = e => {
  return (
    config.DEBUG &&
    (e.level === bunyan.FATAL ||
      e.level === bunyan.ERROR ||
      e.level === bunyan.WARN)
  );
};

// https://cloud.google.com/error-reporting/docs/formatting-error-messages
class StackdriverStream {
  constructor(stream) {
    this.stream = stream;
  }
  write(e) {
    const formatted = {
      severity: stackdriverSeverityByBunyanLevel[e.level],
      message: (e.msg || '') + (e.err ? ` ${e.err.msg}: ${e.err.stack}` : ''),
      context: {
        httpRequest: !e.req
          ? undefined
          : {
            method: e.req.method,
            url: e.req.url,
            responseStatusCode: e.res ? e.res.statusCode : undefined,
            userAgent: e.req.headers['user-agent'],
            referrer: e.req.headers.referer,
            remoteIp: e.req.headers['x-real-ip'],
              // Extra non-stackdriver attributes
              // NOTE: We log all headers only in debug mode (security!)
            headers: logHeaders(e) ? e.req.headers : undefined
          },
        user: 'TODO',
        reportLocation: {
          filePath: 'TODO',
          lineNumber: 0,
          functionName: 'TODO'
        }
      },
      eventTime: e.time,
      serviceContext: {
        service: e.name,
        version: config.APP_VERSION
      },
      // Extra non-stackdriver attributes
      reqId: e.reqId,
      pid: e.pid,
      latency: e.latency
    };

    // Avoid unnecessary log by not logging /infra/healthz calls
    if (
      formatted.message !== 'Request: GET /infra/healthz' &&
      formatted.message !== 'Response: GET /infra/healthz'
    ) {
      this.stream.write(JSON.stringify(formatted));
      this.stream.write('\n');
    }
  }
}

// Supported log formats: text, stackdriver
const logFormatStreams = {
  text: undefined,
  stackdriver: [
    {
      type: 'raw',
      stream: new StackdriverStream(process.stderr),
      level: 'warn'
    },
    {
      type: 'raw',
      stream: new StackdriverStream(process.stdout),
      level: 'info'
    }
  ]
};

const logger = bunyan.createLogger({
  name: config.APP_NAME,
  serializers: bunyan.stdSerializers,
  level: config.DEBUG ? 'trace' : 'info',
  streams: logFormatStreams[process.env.COMMON_LOG_FORMAT]
});

logger.info(
  `Bunyan logger created. Debugging is set to ${config.DEBUG}. ` +
    `Log level is set to '${stackdriverSeverityByBunyanLevel[logger.level()]}'.`
);

function _addCtxToLog(args) {
  const reqId = namespace.get('reqId');
  const req = namespace.get('req');
  const logCtx = namespace.get('logCtx');

  const head = args[0];
  let newHead = { reqId, req, ...logCtx };
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
  const cur = namespace.get('logCtx');
  namespace.set('logCtx', { ...cur, ...obj });
}

const log = {};
log.trace = (...args) => logger.trace(..._addCtxToLog(args));
log.debug = (...args) => logger.debug(..._addCtxToLog(args));
log.info = (...args) => logger.info(..._addCtxToLog(args));
log.warn = (...args) => logger.warn(..._addCtxToLog(args));
log.error = (...args) => logger.error(..._addCtxToLog(args));
log.fatal = (...args) => logger.fatal(..._addCtxToLog(args));

export default log;
export { mergeToCtx, log, namespace };
