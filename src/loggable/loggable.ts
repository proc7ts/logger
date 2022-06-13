import { DueLog } from './due-log.js';

/**
 * A value that may be logged in a custom way.
 *
 * @typeParam TTarget - Processed message type.
 */
export interface Loggable<TTarget extends DueLog.Target = DueLog.Target> {

  /**
   * Performs additional message processing before it is logged.
   *
   * This method is called for each element of the {@link DueLog.line logged message line} in order. It may wish to
   * change the logged message either by modifying it, or by returning a loggable representation of the value.
   *
   * The method call results interpreted as following:
   *
   * 1. If the method replaced the {@link DueLog.line log line} or currently processed element, or updated the next
   *    element's {@link DueLog.index index}, then the returned value is ignored, and the new log line processing
   *    continues from the new element index.
   *
   * 2. If the returned value is `undefined` or the same as `this`, then the log line processing continues from the next
   *    element.
   *
   * 3. If the returned value is {@link Loggable}, it replaces the current element, and the log line processing
   *    continues from the same element index. This allows recurrent processing.
   *
   * 4. If the returned value is an array, then current element is removed and all elements of the returned array are
   *    inserted at the same position. The log line processing continues from the same element index. This allows
   *    recurrent processing. This also makes it possible to remove the value from the log line by returning an empty
   *    array.
   *
   * @param target - Log message to process containing this loggable value at the specified {@link DueLog.index index}.
   *
   * @returns Either new loggable value representation, or nothing or `this` value itself to not replace its loggable
   * representation.
   */
  toLog(target: TTarget & DueLog): void | unknown;

}

/**
 * Checks whether the given value is loggable.
 *
 * @param value - A value to check.
 *
 * @returns `true` is the given `value` has a {@link Loggable.toLog toLog} method, or `false` otherwise.
 */
export function isLoggable(value: unknown): value is Loggable {
  return (typeof value === 'object' && !!value || typeof value === 'function')
      && typeof (value as Partial<Loggable>).toLog === 'function';
}
