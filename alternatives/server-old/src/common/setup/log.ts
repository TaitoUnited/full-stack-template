import bunyan, { LogLevel } from 'bunyan';
import { Transform, TransformCallback, TransformOptions } from 'stream';

import config from './config';

const stackdriverSeverityByBunyanLevel = {
  [bunyan.TRACE]: 'DEBUG',
  [bunyan.DEBUG]: 'DEBUG',
  [bunyan.INFO]: 'INFO',
  [bunyan.WARN]: 'WARNING',
  [bunyan.ERROR]: 'ERROR',
  [bunyan.FATAL]: 'CRITICAL',
};

const allowedHeaders = ['user-agent', 'referer', 'x-real-ip'];

// Adds Stackdriver severity level to log entries
class StackdriverStream extends Transform {
  constructor(options: TransformOptions, output: NodeJS.WritableStream) {
    super({
      ...options,
      objectMode: true,
    });
    this.pipe(output);
  }

  public _transform(
    chunk: {
      level: number;
      severity: string;
      message: string;
      msg: string;
      requestId?: string;
      req?: {
        method: string;
        url: string;
        headers: any;
      };
      res?: {
        statusCode: number;
      };
      err?: {
        message: string;
      };
      requestMs?: {
        toJSON: () => number;
      };
      labels?: any;
    },
    _: string,
    callback: TransformCallback
  ) {
    chunk.severity = stackdriverSeverityByBunyanLevel[chunk.level];
    chunk.labels = {
      ...chunk.labels,
      project: config.COMMON_PROJECT,
      company: config.COMMON_COMPANY,
      family: config.COMMON_FAMILY,
      application: config.COMMON_APPLICATION,
      suffix: config.COMMON_SUFFIX,
      domain: config.COMMON_DOMAIN,
      imageTag: config.COMMON_IMAGE_TAG,
      env: config.COMMON_ENV,
    };
    const messageParts = [];
    if (chunk.requestId) {
      messageParts.push(`requestId=${chunk.requestId}`);
    }
    if (chunk.requestMs) {
      messageParts.push(`requestMs=${chunk.requestMs.toJSON()}`);
    }
    if (chunk.req) {
      messageParts.push(`request=${chunk.req.method} ${chunk.req.url}`);

      if (chunk.req.headers) {
        const filteredHeaders = Object.keys(chunk.req.headers)
          .filter((key) => allowedHeaders.includes(key))
          .reduce((h, key) => {
            h[key] = (chunk.req as any).headers[key];
            return h;
          }, {} as any);
        chunk.req.headers = filteredHeaders;
      }
    }
    if (chunk.res) {
      messageParts.push(`response=${chunk.res.statusCode}`);
    }
    if (chunk.err) {
      messageParts.push(`error=${chunk.err.message}`);
    }
    messageParts.push(chunk.msg);
    chunk.message = messageParts.join(', ');
    callback(undefined, `${JSON.stringify(chunk)}\n`);
  }
}

// Supported log formats: text, stackdriver
// TODO: If config.COMMON_LOG_FORMAT is 'text', use the StackdriverStream,
// but enable also this: https://github.com/benbria/bunyan-debug-stream
const logFormatStreams = {
  stackdriver: [
    {
      type: 'raw',
      stream: new StackdriverStream({}, process.stderr),
      level: bunyan.WARN,
    },
    {
      type: 'raw',
      stream: new StackdriverStream({}, process.stdout),
      level: bunyan.INFO,
    },
  ],
};

const log = bunyan.createLogger({
  name: config.APP_NAME,
  serializers: bunyan.stdSerializers,
  src: true,
  streams: logFormatStreams.stackdriver,
});

export default log;
