import bunyan, { LogLevel } from "bunyan";
import { Transform, TransformCallback, TransformOptions } from "stream";
import config from "./config";

const stackdriverSeverityByBunyanLevel = {
  [bunyan.TRACE]: "DEBUG",
  [bunyan.DEBUG]: "DEBUG",
  [bunyan.INFO]: "INFO",
  [bunyan.WARN]: "WARNING",
  [bunyan.ERROR]: "ERROR",
  [bunyan.FATAL]: "CRITICAL"
};

// Adds Stackdriver severity level to log entries
class StackdriverStream extends Transform {
  constructor(options: TransformOptions, output: NodeJS.WritableStream) {
    super({
      ...options,
      objectMode: true
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
    },
    _: string,
    callback: TransformCallback
  ) {
    chunk.severity = stackdriverSeverityByBunyanLevel[chunk.level];
    const messageParts = [];
    if (chunk.requestId) {
      messageParts.push(`requestId=${chunk.requestId}`);
    }
    if (chunk.requestMs) {
      messageParts.push(`requestMs=${chunk.requestMs.toJSON()}`);
    }
    if (chunk.req) {
      messageParts.push(`request=${chunk.req.method} ${chunk.req.url}`);
    }
    if (chunk.res) {
      messageParts.push(`response=${chunk.res.statusCode}`);
    }
    if (chunk.err) {
      messageParts.push(`error=${chunk.err.message}`);
    }
    messageParts.push(chunk.msg);
    chunk.message = messageParts.join(", ");
    callback(undefined, `${JSON.stringify(chunk)}\n`);
  }
}

// Supported log formats: text, stackdriver
const logFormatStreams = {
  text: [
    {
      level: (config.COMMON_LOG_LEVEL as LogLevel) || bunyan.INFO,
      stream: process.stdout
    }
  ],

  stackdriver: [
    {
      type: "raw",
      stream: new StackdriverStream({}, process.stderr),
      level: bunyan.WARN
    },
    {
      type: "raw",
      stream: new StackdriverStream({}, process.stdout),
      level: bunyan.INFO
    }
  ]
};

const log = bunyan.createLogger({
  name: config.APP_NAME,
  serializers: bunyan.stdSerializers,
  src: true,
  streams:
    logFormatStreams[
      (config.COMMON_LOG_FORMAT as "text" | "stackdriver") || "stackdriver"
    ]
});

export default log;
