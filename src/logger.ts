import { CxEntry, CxGlobals, cxRecent, cxScoped } from '@proc7ts/context-values';
import { consoleLogger, proxyLogger } from './loggers';

/**
 * Basic logger interface.
 */
export interface Logger {

  /**
   * Logs error.
   *
   * @param args - Arbitrary arguments to log.
   */
  error(...args: unknown[]): void;

  /**
   * Logs warning.
   *
   * @param args - Arbitrary arguments to log.
   */
  warn(...args: unknown[]): void;

  /**
   * Logs informational message.
   *
   * @param args - Arbitrary arguments to log.
   */
  info(...args: unknown[]): void;

  /**
   * Logs debug message.
   *
   * @param args - Arbitrary arguments to log.
   */
  debug(...args: unknown[]): void;

  /**
   * Logs tracing message.
   *
   * This may lead to outputting of stack trace.
   *
   * @param args - Arbitrary arguments to log.
   */
  trace(...args: unknown[]): void;

}

/**
 * Global context entry containing logger to use.
 *
 * Logs to {@link consoleLogger console} by default.
 */
export const Logger: CxEntry<Logger> = {
  perContext: (/*#__PURE__*/ cxScoped(
      CxGlobals,
      (/*#__PURE__*/ cxRecent({
        create: (recent, _) => recent,
        byDefault: _ => consoleLogger,
        assign({ get, to }) {

          const logger = proxyLogger(get);

          return receiver => to((_, by) => receiver(logger, by));
        },
      })),
  )),
  toString: () => '[Logger]',
};
