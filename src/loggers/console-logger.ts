import { HeadlessLogger } from '../headless-logger.js';
import { processingLogger } from './processing-logger.js';

const consoleLogger$log = (log: (...args: unknown[]) => void) => (...args: unknown[]) => {
  if (typeof args[0] === 'string') {
    // Avoid formatting.
    log('%s', ...args);
  } else {
    log(...args);
  }
};

/**
 * Logger instance that logs to console.
 *
 * Processes {@link Loggable} values.
 *
 * Ignores [string substitutions].
 *
 * [string substitutions]: https://developer.mozilla.org/en-US/docs/Web/API/Console#using_string_substitutions
 */
export const consoleLogger: HeadlessLogger = (/*#__PURE__*/ processingLogger({
  error: (/*#__PURE__*/ consoleLogger$log((...args) => console.error(...args))),
  warn: (/*#__PURE__*/ consoleLogger$log((...args) => console.warn(...args))),
  info: (/*#__PURE__*/ consoleLogger$log((...args) => console.info(...args))),
  debug: (/*#__PURE__*/ consoleLogger$log((...args) => console.debug(...args))),
  trace: (/*#__PURE__*/ consoleLogger$log((...args) => console.trace(...args))),
}));
