import { describe, expect, it } from '@jest/globals';
import { dueLog } from './due-log';
import { Loggable } from './loggable';
import { logline } from './logline';

describe('logline', () => {
  it('joins non-separate values', () => {
    expect(fmt`1${2}3${4}5`).toEqual(['12345']);
  });
  it('joins subsequent non-separate values', () => {
    expect(fmt`1 ${2}${3}${4} 5`).toEqual(['1', '234', '5']);
  });
  it('does not join with separate prefix', () => {
    expect(fmt`1 ${2}3`).toEqual(['1', '23']);
  });
  it('does not join with separate suffix', () => {
    expect(fmt`1${2} 3`).toEqual(['12', '3']);
  });
  it('does not join with separate prefix and suffix', () => {
    expect(fmt`1 ${2} 3`).toEqual(['1', 2, '3']);
  });
  it('joins non-separated prefix', () => {
    expect(fmt`1${2} ${3} 4`).toEqual(['12', 3, '4']);
    expect(fmt`1${2}- ${3} 4`).toEqual(['12-', 3, '4']);
    expect(fmt`1${2} -${3} 4`).toEqual(['12', '-3', '4']);
  });
  it('joins non-separated suffix', () => {
    expect(fmt`1 ${2} ${3}4`).toEqual(['1', 2, '34']);
    expect(fmt`1 ${2} -${3}4`).toEqual(['1', 2, '-34']);
    expect(fmt`1 ${2}- ${3}4`).toEqual(['1', '2-', '34']);
  });
  it('normalizes strings', () => {
    expect(fmt`
      prefix
      string
      ${1}
      suffix \t  string
    `).toEqual(['prefix string', 1, 'suffix string']);
  });
  it('join loggable values', () => {

    const loggable: Loggable = {
      toLog: () => '*',
    };

    expect(fmt`-${loggable}-`).toEqual(['-*-']);
  });
  it('join loggable values on output', () => {

    const loggable: Loggable = {
      toLog: () => '*',
    };

    const [item] = infmt`-${loggable}-`;

    expect(typeof item).toBe('object');

    expect(dueLog({ on: 'out', line: [item] }).line).toEqual(['-*-']);
  });

  function fmt(strings: TemplateStringsArray, ...args: unknown[]): unknown[] {
    return dueLog({ line: [logline(strings, ...args)] }).line;
  }

  function infmt(strings: TemplateStringsArray, ...args: unknown[]): unknown[] {
    return dueLog({ on: 'in', line: [logline(strings, ...args)] }).line;
  }
});
