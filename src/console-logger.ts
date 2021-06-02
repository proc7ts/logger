import { Logger } from './logger';

const consoleLogger$log = (log: (...args: unknown[]) => void) => (...args: unknown[]) => {
    if (args.length && typeof args[0] === 'string') {
      // Avoid formatting.
      log('%s', ...args);
    } else {
      log(...args);
    }
  };

const consoleLogger$error = (/*#__PURE__*/ consoleLogger$log((...args) => console.error(...args)));
const consoleLogger$warn = (/*#__PURE__*/ consoleLogger$log((...args) => console.warn(...args)));
const consoleLogger$info = (/*#__PURE__*/ consoleLogger$log((...args) => console.info(...args)));
const consoleLogger$debug = (/*#__PURE__*/ consoleLogger$log((...args) => console.debug(...args)));
const consoleLogger$trace = (/*#__PURE__*/ consoleLogger$log((...args) => console.trace(...args)));

/**
 * Logger instance that logs to console.
 */
export const consoleLogger: Logger = {

  get error() {
    return consoleLogger$error;
  },

  get warn() {
    return consoleLogger$warn;
  },

  get info() {
    return consoleLogger$info;
  },

  get debug() {
    return consoleLogger$debug;
  },

  get trace() {
    return consoleLogger$trace;
  },

};
