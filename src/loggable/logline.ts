import { DueLog } from './due-log';
import { Loggable } from './loggable';

const logline$eachWsPattern = /\s+/g;
const logline$insertSpace = (): string => ' ';
const logline$append = (result: unknown[], str: string): void => {

  const text = str.replace(logline$eachWsPattern, logline$insertSpace);

  if (text) {
    result.push(text);
  }
};
const logline$join = (result: unknown[], joins: unknown[]): void => {
  if (joins.length) {

    const loggable: Loggable = {
      toLog(target: DueLog): string | void {

        // Remember the containing log line and position.
        const { on = 'out', line, index } = target;

        // The loggable to apply after joining.
        const endJoin: Loggable = {
          toLog(target) {
            // Read the join results.
            joins = target.line.slice(0, -1); // The last element is this loggable.

            if (!joins.length) {
              // Nothing left to join.
              line.splice(index, 1);
              // Restore containing log line with `logline` removed.
              target.line = line;
              // Go on from the same position.
              target.index = index;

              return;
            }

            if (on === 'out') {
              // Finally join into a string.
              line[index] = joins.join('');
            }

            // Restore containing log line.
            target.line = line;
            // Go on from the next element to avoid immediate re-processing.
            target.index = index + 1;
          },
        };

        // Initiate joining by replacing a log line to process.
        target.line = [...joins, /* resumes normal processing */ endJoin];
        target.index = 0;
      },
    };

    result.push(loggable);
  }
};

/**
 * A tagged string prefix that creates a processed log line.
 *
 * The returned log line can be used in any form:
 *
 * ```typescript
 * logger.info(...logline`Logged value: ${value}`); // Explicitly expand the log line.
 * logger.info(logline`Logged value: ${value}`); // The log line will be expanded by logger.
 * ```
 *
 * The log line is created accordingly to the following rules:
 *
 * 1. Template strings and values not separated with whitespace are joined into single string.
 * 2. The values separated by whitespaces are added to the log line as is.
 * 3. Template strings are trimmed.
 * 4. Any number of subsequent whitespaces in template string is replaced with single space.
 * 5. Leading and/or trailing template string is removed if it became empty.
 *
 * All {@link Loggable} values processes before being joined into string. They may be processed as many times as
 * requested. The joining when the {@link DueLog.on logging stage} is set to `out` or is undefined.
 *
 * @returns Processed log line additionally implementing {@link Loggable} interface.
 */
export function logline(
    strings: TemplateStringsArray,
    ...args: readonly unknown[]
): unknown[] & Loggable {

  const result = ([] as unknown[]) as unknown[] & Loggable;

  result.toLog = () => result.slice(); // Return a non-Loggable clone.

  let joins: unknown[] = [];
  const length = args.length;
  const firstPrefix = strings[0].trimLeft();
  let prefix = firstPrefix.trimRight();
  let joinArg = firstPrefix && firstPrefix.length === prefix.length;

  logline$append(joinArg ? joins : result, prefix);

  for (let i = 0; i < length; ++i) {

    const arg = args[i];
    const nextSuffix = strings[i + 1];
    const suffix = nextSuffix.trimLeft();
    let joinSuffix = false;

    if (joinArg) {
      joins.push(arg);
      if (!nextSuffix || nextSuffix.length === suffix.length) {
        joinSuffix = true;
      } else {
        logline$join(result, joins);
        joins = [];
      }
    } else {
      logline$join(result, joins);
      joins = [];
      if (!nextSuffix || nextSuffix.length === suffix.length) {
        joins.push(arg);
        joinSuffix = true;
      } else {
        result.push(arg);
      }
    }

    prefix = suffix.trimRight();

    joinArg = suffix ? prefix.length === suffix.length : !nextSuffix;
    if (joinSuffix) {
      logline$append(joins, prefix);
    } else {
      logline$join(result, joins);
      joins = [];
      logline$append(joinArg ? joins : result, prefix);
    }
  }

  logline$join(result, joins);

  return result;
}
