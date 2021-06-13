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

export function logline(
    strings: TemplateStringsArray,
    ...args: readonly unknown[]
): unknown[] {

  const result: unknown[] = [];
  let joins: unknown[] = [];
  const length = args.length;
  let prefixJoined = false;

  for (let i = 0; i < length; ++i) {

    const arg = args[i];
    const prefix = strings[i];
    const suffix = strings[i + 1];

    if (prefix && !logline$lastWsPattern.test(prefix)) {
      if (!prefixJoined) {
        logline$append(joins, prefix);
      }
      joins.push(arg);
      if (suffix && !logline$firstWsPattern.test(suffix)) {
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

      if (suffix && !logline$firstWsPattern.test(suffix)) {
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
