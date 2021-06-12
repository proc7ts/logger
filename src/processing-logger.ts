import { dueLog } from './due-log';
import { Logger } from './logger';

/**
 * Creates a logger that processes {@link Loggable} values and logs with another logger.
 *
 * @param logger - A logger to log processed messages with.
 * @param on - A {@link DueLog.on hint} indicating the logging stage. Undefined by default.
 *
 * @returns New processing logger instance.
 */
export function processingLogger(logger: Logger, { on }: { on?: string } = {}): Logger {

  const logMethod = (log: (...args: unknown[]) => void): (...args: unknown[]) => void => (...args) => {
    if (args.length) {

      const { line } = dueLog({ on, line: args });

      if (line.length) {
        log(...line);
      }
    } else {
      log();
    }
  };

  return {
    error: logMethod((...args) => logger.error(...args)),
    warn: logMethod((...args) => logger.warn(...args)),
    info: logMethod((...args) => logger.info(...args)),
    debug: logMethod((...args) => logger.debug(...args)),
    trace: logMethod((...args) => logger.trace(...args)),
  };
}
