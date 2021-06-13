import { HeadlessLogger } from '../headless-logger';

const silentLogger$log = (..._args: unknown[]): void => { /* Do not log */ };

/**
 * Logger instance that suppresses logging, i.e. never logs anything.
 */
export const silentLogger: HeadlessLogger = {

  error: silentLogger$log,
  warn: silentLogger$log,
  info: silentLogger$log,
  debug: silentLogger$log,
  trace: silentLogger$log,

};
