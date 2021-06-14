import { dueLog, DueLog } from './due-log';
import { Loggable } from './loggable';

const logline$firstWsPattern = /^\s/;
const logline$lastWsPattern = /\s$/;
const logline$eachWsPattern = /\s+/g;
const logline$replaceByString = (): string => ' ';
const logline$normalize = (str: string): string => str.trim().replace(logline$eachWsPattern, logline$replaceByString);
const logline$append = (result: unknown[], str: string): void => {

  const text = logline$normalize(str);

  if (text) {
    result.push(text);
  }
};
const logline$join = (result: unknown[], line: unknown[]): void => {
  if (line.length) {

    const loggable: Loggable = {
      toLog({ on = 'out' }: DueLog): string | void {
        line = dueLog({ line }).line;
        if (on === 'out') {
          return line.join('');
        }
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
  let prefixJoined = false;

  for (let i = 0; i < length; ++i) {

    const arg = args[i];
    const prefix = strings[i];
    const suffix = strings[i + 1];

    if (!prefix || !logline$lastWsPattern.test(prefix)) {
      if (!prefixJoined) {
        logline$append(joins, prefix);
      }
      joins.push(arg);
      if (!suffix || !logline$firstWsPattern.test(suffix)) {
        logline$append(joins, suffix);
        prefixJoined = true;
      } else {
        logline$join(result, joins);
        joins = [];
        prefixJoined = false;
      }
    } else {
      logline$join(result, joins);
      joins = [];
      if (!prefixJoined) {
        logline$append(result, prefix);
      }

      if (!suffix || !logline$firstWsPattern.test(suffix)) {
        joins.push(arg);
        logline$append(joins, suffix);
        prefixJoined = true;
      } else {
        result.push(arg);
        prefixJoined = false;
      }
    }
  }

  logline$join(result, joins);
  if (!prefixJoined) {
    logline$append(result, strings[length]);
  }

  return result;
}
