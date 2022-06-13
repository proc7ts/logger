import { HeadlessLogger } from '../headless-logger.js';
import { Logger } from '../logger.js';

/**
 * Creates a logger that proxies logging to another one.
 *
 * @param getLogger - A function that returns a logger to proxy log messages to. It is called on _each_ logger method
 * call.
 *
 * @returns New headless proxy logger.
 */
export function proxyLogger(getLogger: (this: void) => Logger): HeadlessLogger {

  const logMethod = (log: (logger: Logger, args: unknown[]) => void): (...args: unknown[]) => void => (
      ...args
  ) => log(getLogger(), args);

  return {
    error: logMethod((logger, args) => logger.error(...args)),
    warn: logMethod((logger, args) => logger.warn(...args)),
    info: logMethod((logger, args) => logger.info(...args)),
    debug: logMethod((logger, args) => logger.debug(...args)),
    trace: logMethod((logger, args) => logger.trace(...args)),
  };
}
