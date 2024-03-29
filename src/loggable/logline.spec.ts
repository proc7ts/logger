import { describe, expect, it } from '@jest/globals';
import { Logger } from '../logger.js';
import { processingLogger } from '../loggers/mod.js';
import { Loggable } from './loggable.js';
import { logline } from './logline.js';

describe('logline', () => {
  const logToNone: Loggable = {
    toLog: () => [],
  };

  it('reports single value as is', () => {
    expect(log(logline`${1}`)).toEqual([1]);
  });
  it('reports leading value as is', () => {
    expect(log(logline`${1} suffix`)).toEqual([1, 'suffix']);
  });
  it('reports trailing value as is', () => {
    expect(log(logline`prefix ${1}`)).toEqual(['prefix', 1]);
  });
  it('reports separated values as is', () => {
    expect(log(logline`${1} ${2} ${3} ${4}`)).toEqual([1, 2, 3, 4]);
  });
  it('joins non-separate values', () => {
    expect(log(logline`1${2}3${4}5`)).toEqual(['12345']);
  });
  it('joins subsequent non-separate values', () => {
    expect(log(logline`1 ${2}${3}${4} 5`)).toEqual(['1', '234', '5']);
  });
  it('does not join with separate prefix', () => {
    expect(log(logline`1 ${2}3`)).toEqual(['1', '23']);
  });
  it('does not join with separate suffix', () => {
    expect(log(logline`1${2} 3`)).toEqual(['12', '3']);
  });
  it('does not join with separate prefix and suffix', () => {
    expect(log(logline`1 ${2} 3`)).toEqual(['1', 2, '3']);
  });
  it('joins non-separated prefix', () => {
    expect(log(logline`1${2} ${3} 4`)).toEqual(['12', 3, '4']);
    expect(log(logline`1${2}- ${3} 4`)).toEqual(['12-', 3, '4']);
    expect(log(logline`1${2} -${3} 4`)).toEqual(['12', '-3', '4']);
  });
  it('joins non-separated suffix', () => {
    expect(log(logline`1 ${2} ${3}4`)).toEqual(['1', 2, '34']);
    expect(log(logline`1 ${2} -${3}4`)).toEqual(['1', 2, '-34']);
    expect(log(logline`1 ${2}- ${3}4`)).toEqual(['1', '2-', '34']);
  });
  it('normalizes strings', () => {
    expect(
      log(logline`
      prefix
      string
      ${1}
      suffix \t  string
    `),
    ).toEqual(['prefix string', 1, 'suffix string']);
  });
  it('joins loggable values', () => {
    const loggable: Loggable = {
      toLog: () => '*',
    };

    expect(log(logline`-${loggable}-`)).toEqual(['-*-']);
  });
  it('joins loggable values on output', () => {
    const loggable: Loggable = {
      toLog: () => '*',
    };

    const [item] = logOn('in', logline`-${loggable}-`);

    expect(typeof item).toBe('object');

    expect(logOn('out', item)).toEqual(['-*-']);
  });
  it('can be expanded explicitly or automatically', () => {
    expect(log('(start)', ...logline`1 ${2} 3`, '(end)')).toEqual([
      '(start)',
      '1',
      2,
      '3',
      '(end)',
    ]);
    expect(log('(start)', logline`1 ${2} 3`, '(end)')).toEqual(['(start)', '1', 2, '3', '(end)']);
  });
  it('produces nothing on empty log line', () => {
    expect(log(logline``)).toEqual([]);
    expect(log(...logline``)).toEqual([]);
    expect(log(logline`  `)).toEqual([]);
    expect(log(...logline`  `)).toEqual([]);
  });
  it('handles no-op loggable values', () => {
    expect(log(logline`(${logToNone}${logToNone})`)).toEqual(['()']);
    expect(log(logline`( ${logToNone}${logToNone} )`)).toEqual(['(', ')']);
    expect(log(logline`(${logToNone}${logToNone} )`)).toEqual(['(', ')']);
    expect(log(logline`( ${logToNone}${logToNone})`)).toEqual(['(', ')']);
    expect(log(logline`( ${logToNone} ${logToNone} )`)).toEqual(['(', ')']);
    expect(log(logline`(${logToNone} ${logToNone})`)).toEqual(['(', ')']);
    expect(log(logline`${logToNone} ${logToNone}`)).toEqual([]);
    expect(log(logline`${logToNone}${logToNone}`)).toEqual([]);
  });

  function log(...args: unknown[]): unknown[] {
    return logOn(undefined, ...args);
  }

  function logOn(on: string | undefined, ...args: unknown[]): unknown[] {
    let logged!: unknown[];
    const logger: Partial<Logger> = {
      info(...args: unknown[]) {
        logged = args;
      },
    };

    processingLogger(logger as Logger, { on }).info(...args);

    return logged;
  }
});
