import type { LoggerOptions } from 'pino';

const gcpSeverityByPinoLevel: Record<string, string> = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

export function createGcpLoggingConfig(
  options: LoggerOptions = {}
): LoggerOptions {
  const formatters = options.formatters;
  const customLogFormatter = options.formatters?.log;

  return {
    ...options,
    messageKey: 'message',
    formatters: {
      ...formatters,
      level: (label, level) => ({
        severity: gcpSeverityByPinoLevel[label] ?? 'INFO',
        level,
      }),
      log: (entry) => {
        const formattedEntry = customLogFormatter
          ? customLogFormatter(entry)
          : entry;

        if (entry.err instanceof Error && entry.err.stack) {
          formattedEntry.stack_trace = entry.err.stack;
        }

        return formattedEntry;
      },
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  };
}
