import { Logger } from './logger';

/**
 * Headless logger interface.
 *
 * In contrast to {@link Logger basis logger}, the methods of this one do not require a `this` context, and can be used
 * as functions.
 */
export interface HeadlessLogger extends Logger {

  error(this: void, ...args: unknown[]): void;

  warn(this: void, ...args: unknown[]): void;

  info(this: void, ...args: unknown[]): void;

  debug(this: void, ...args: unknown[]): void;

  trace(this: void, ...args: unknown[]): void;

}
