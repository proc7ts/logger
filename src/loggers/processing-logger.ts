import { HeadlessLogger } from '../headless-logger.js';
import { dueLog } from '../loggable/mod.js';
import { Logger } from '../logger.js';

/**
 * Creates a logger that processes {@link Loggable} values and logs with another logger.
 *
 * @param logger - A logger to log processed messages with.
 * @param on - A {@link DueLog.on hint} indicating the logging stage. Undefined by default.
 *
 * @returns New headless processing logger.
 */
export function processingLogger(logger: Logger, { on }: { on?: string } = {}): HeadlessLogger {
  const logMethod
    = (log: (...args: unknown[]) => void): ((...args: unknown[]) => void) => (...args) => {
      const { line } = dueLog({ on, line: args });

      log(...line);
    };

  return {
    error: logMethod((...args) => logger.error(...args)),
    warn: logMethod((...args) => logger.warn(...args)),
    info: logMethod((...args) => logger.info(...args)),
    debug: logMethod((...args) => logger.debug(...args)),
    trace: logMethod((...args) => logger.trace(...args)),
  };
}
