import { DueLog } from './due-log.js';
import { Loggable } from './loggable.js';

/**
 * Creates a loggable value processed when the message is actually logged.
 *
 * The value will be {@link Loggable.toLog expanded} at `out` {@link DueLog.on logging stage}.
 *
 * @param toLog - Performs additional message processing before it is logged. It will be called by
 * {@link @Loggable.toLog} method implementation at appropriate logging stage.
 *
 * @returns New loggable value.
 */
export function logDefer<TTarget extends DueLog.Target>(
    toLog: (this: void, target: TTarget) => unknown | void,
): Loggable<TTarget> {
  return {
    toLog(target) {

      const { on = 'out' } = target;

      if (on === 'out') {
        return toLog(target);
      }
    },
  };
}
