import { describe, expect, it } from '@jest/globals';
import { dueLog } from './due-log';
import { logDefer } from './log-defer';

describe('logDefer', () => {
  it('is not expanded on input', () => {

    const deferred = logDefer(() => ({ foo: 'bar' }));

    expect(dueLog({ on: 'in', line: [deferred] }).line).toEqual([deferred]);
  });
  it('is expanded on output', () => {
    expect(dueLog({ on: 'out', line: [logDefer(() => ({ foo: 'bar' }))] }).line).toEqual([{ foo: 'bar' }]);
  });
  it('is expanded at undefined logging stage', () => {
    expect(dueLog({ line: [logDefer(() => ({ foo: 'bar' }))] }).line).toEqual([{ foo: 'bar' }]);
  });
});
