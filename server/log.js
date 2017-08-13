import bunyan from 'bunyan';
import _ from 'lodash';

import config from './config';
import ns from './cls';

const levelMap = {
  [bunyan.TRACE]: 'TRACE',
  [bunyan.DEBUG]: 'DEBUG',
  [bunyan.INFO]: 'INFO',
  [bunyan.WARN]: 'WARN',
  [bunyan.ERROR]: 'ERROR',
  [bunyan.FATAL]: 'FATAL',
};

const logger = bunyan.createLogger({
  name: config.APP_NAME,
  serializers: bunyan.stdSerializers,
  level: config.DEBUG ? 'trace' : 'info',
  streams: [
    {
      stream: process.stderr,
      level: 'warn',
    },
    {
      stream: process.stdout,
      level: 'info',
    },
  ],
});

logger.info(
  `Bunyan logger created. Debugging is set to ${config.DEBUG}. ` +
  `Log level is set to '${levelMap[logger.level()]}'.`
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
