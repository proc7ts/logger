import { isLoggable, Loggable } from './loggable';

/**
 * A message about to be logged.
 *
 * Such message can be additionally {@link Loggable.toLog processed} before it is written to the log.
 */
export interface DueLog {

  /**
   * A hint indicating the logging stage.
   *
   * A {@link Loggable.toLog log processor} may wish to conditionally process the message depending on the stage.
   *
   * Possible values are:
   *
   * - `'in'` - _input stage_. Set for the logger input. I.e., for the log line passed to the logger method.
   * - `'out'` - _output stage_. Set by log writer. I.e., right before the message written to the log.
   * - `undefined` - _default stage_. When set, the value should be processed unconditionally.
   *
   * Some logger implementations may wish to use this hint for special processing. If the stage is not recognized
   * by the loggable value, then it is generally means no processing should be performed.
   */
  on?: string;

  /**
   * Log line to process and log.
   *
   * Can be modified or replaced to change the message to log.
   */
  line: unknown[];

  /**
   * An index of currently processed element of the log {@link line}.
   *
   * Can be modified to specify the next element to process.
   */
  index: number;

}

export namespace DueLog {

  /**
   * A message to process before being logged.
   *
   * Has the same structure as {@link DueLog} but some properties may be initially omitted. They will be fulfilled
   * by {@link dueLog} before returned.
   */
  export interface Target {

    /**
     * A hint indicating the logging stage.
     *
     * @see DueLog.on
     */
    on?: string;

    /**
     * Log line to process.
     *
     * After processing will be updated to the final log line.
     *
     * @see DueLog.line
     */
    line: unknown[];

    /**
     * An index of the first element of the log {@link line} to process.
     *
     * Defaults to `0`. When set to negative value, reset to `0`. When set to the value greater than the length of the
     * log line, reset to the log line length.
     *
     * After processing will be set to the length of the final log line.
     *
     * @see DueLog.index
     */
    index?: number;

  }

  /**
   * Custom loggable value processing handlers.
   *
   * @typeParam TTarget - Processed message type.
   */
  export interface Handlers<TTarget extends DueLog.Target = DueLog.Target> {

    /**
     * Handles raw (i.e. non-{@link Loggable}) value.
     *
     * The handler execution results treated similarly to {@link Loggable.toLog}.
     *
     * Does nothing by default.
     *
     * @param target - Target (mutable) message to process.
     * @param value - The raw value to process.
     *
     * @returns Either new loggable value representation, or nothing or `this` value itself to not replace its loggable
     * representation.
     */
    onRaw?(this: void, target: TTarget & DueLog, value: unknown): void | unknown;

    /**
     * Handles {@link Loggable} value.
     *
     * The handler execution results treated similarly to {@link Loggable.toLog}.
     *
     * By default, calls {@link Loggable.toLog} and returns its value.
     *
     * @param target - Target (mutable) message to process.
     * @param value - The loggable value to process.
     *
     * @returns Either new loggable value representation, or nothing or `this` value itself to not replace its loggable
     * representation.
     */
    onLoggable?(this: void, target: TTarget & DueLog, value: Loggable): void | unknown;

  }

}

/**
 * Processes the target log message.
 *
 * @typeParam TTarget - Processed message type.
 * @param target - Target (mutable) message to process.
 * @param handlers - Custom value handlers.
 *
 * @returns Processed `target` message.
 *
 * @see Loggable.toLog for loggable value processing rules.
 */
export function dueLog<TTarget extends DueLog.Target>(
    target: TTarget,
    handlers?: DueLog.Handlers<TTarget>,
): TTarget & DueLog;

export function dueLog<TTarget extends DueLog.Target>(
    target: TTarget,
    {
      onRaw = DueLog$onRaw,
      onLoggable = DueLog$onLoggable,
    }: DueLog.Handlers<TTarget> = {},
): TTarget & DueLog {

  const { index: firstIndex = 0 } = target;

  target.index = Math.max(firstIndex, 0);

  const due = target as TTarget & DueLog;

  while (due.index < due.line.length) {

    const { line, index } = due;
    const value = line[index];
    const toLog = isLoggable(value)
        ? onLoggable(due, value)
        : onRaw(due, value);

    if (due.index !== index) {
      due.index = Math.max(due.index, 0);
    } else if (due.line === line) {
      if (toLog === undefined || toLog === value) {
        ++due.index;
      } else if (!isLoggable(toLog) && Array.isArray(toLog)) {
        line.splice(index, 1, ...toLog);
      } else {
        line[index] = toLog;
      }
    }
  }

  due.index = Math.min(due.index, due.line.length);

  return due;
}

function DueLog$onRaw(_target: DueLog, _value: unknown): void {
  // Do not process the value.
}

function DueLog$onLoggable(target: DueLog, value: Loggable): void | unknown {
  return value.toLog(target);
}
