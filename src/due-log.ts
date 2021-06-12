import { isLoggable } from './loggable';

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
   * - `'in'` is set for logger input. I.e. for the log line passed to the logger method.
   * - `'out'` is set by log writer. I.e. right before the message is written to the log.
   * - `undefined` when the value should be processed unconditionally.
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
   * May be equal to the log line length to indicate additional value processing that may affect the message to log.
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
     * After processing will be set to the value equal or greater then the length of the final log line.
     *
     * @see DueLog.index
     */
    index?: number;

  }

}

/**
 * Processes the target log message.
 *
 * Processes single `value` instead of the whole log line when the second parameter specified.
 *
 * @param target - Target (mutable) message to process.
 * @param value - The value to process instead of the one from the log line.
 *
 * @returns Processed `target` message.
 *
 * @see Loggable.toLog for loggable value processing rules.
 */
export function dueLog(target: DueLog.Target, value?: unknown): DueLog {

  const { index = 0 } = target;

  target.index = Math.min(Math.max(index, 0), target.line.length);

  const t = target as DueLog;

  if (value !== undefined) {
    dueLog$value(t, value);
  } else {
    while (t.index < t.line.length) {
      dueLog$value(t, t.line[t.index]);
    }
  }

  return t;
}

function dueLog$value(target: DueLog, value: unknown): void {

  const { line, index } = target;

  for (; ;) {
    if (!isLoggable(value)) {
      ++target.index;
      break;
    }

    const toLog = value.toLog(target);

    if (target.index !== index) {
      target.index = Math.max(target.index, 0);
      break;
    }
    if (target.line !== line) {
      break;
    }
    if (toLog === undefined || toLog === value) {
      ++target.index;
      break;
    }

    if (!isLoggable(toLog) && Array.isArray(toLog)) {
      line.splice(index, 1, ...toLog);
      if (index >= line.length) {
        target.index = line.length;
        break;
      }
      value = line[index];
    } else {
      value = line[index] = toLog;
    }
  }

  target.index = Math.min(target.index, target.line.length);
}
