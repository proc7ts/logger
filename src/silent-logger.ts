import { Logger } from './logger';

const silentLogger$log = (..._args: unknown[]): void => { /* Do not log */ };

/**
 * Logger instance that suppresses logging, i.e. never logs anything.
 */
export const silentLogger: Logger = {

  get error() {
    return silentLogger$log;
  },

  get warn() {
    return silentLogger$log;
  },

  get info() {
    return silentLogger$log;
  },

  get debug() {
    return silentLogger$log;
  },

};
