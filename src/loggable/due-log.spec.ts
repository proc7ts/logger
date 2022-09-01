import { describe, expect, it } from '@jest/globals';
import { dueLog } from './due-log.js';
import { Loggable } from './loggable.js';

describe('dueLog', () => {
  const logAsTest = loggable('test');
  const logAsNone = loggable([]);
  const logAsArray = loggable([11, 22, 33]);
  const logUpdater: Loggable = {
    toLog({ line, index }) {
      line[index] = '*';
    },
  };
  const logMover: Loggable = {
    toLog(target) {
      target.index += 2;
    },
  };
  const logReplacer: Loggable = {
    toLog(target) {
      target.line = [logAsArray];
      target.index = 0;
    },
  };

  it('starts from first element by default', () => {
    expect(dueLog({ line: [1, 2] })).toEqual({ line: [1, 2], index: 2 });
  });
  it('resets negative index to `0`', () => {
    expect(dueLog({ line: [1, 2], index: -1 })).toEqual({ line: [1, 2], index: 2 });
  });
  it('resets too large index to line length', () => {
    expect(dueLog({ line: [1, logAsTest, 2], index: 23 })).toEqual({
      line: [1, logAsTest, 2],
      index: 3,
    });
  });
  it('does not alter raw value', () => {
    expect(dueLog({ line: [1, 2, 'test'] })).toEqual({ line: [1, 2, 'test'], index: 3 });
  });
  it('handles log line element replacement', () => {
    const toLog: Loggable = {
      toLog(target) {
        target.line[target.index] = logAsTest;
      },
    };

    expect(dueLog({ line: [1, toLog, 2] })).toEqual({ line: [1, 'test', 2], index: 3 });
  });
  it('replaces log line element by loggable representation', () => {
    expect(dueLog({ line: [1, logAsTest, 2] })).toEqual({ line: [1, 'test', 2], index: 3 });
  });
  it('recursively replaces log line element by loggable representation', () => {
    expect(dueLog({ line: [1, loggable(logAsTest), 2] })).toEqual({
      line: [1, 'test', 2],
      index: 3,
    });
  });
  it('replaces log line element by representation elements', () => {
    expect(dueLog({ line: [1, logAsArray, 2] })).toEqual({ line: [1, 11, 22, 33, 2], index: 5 });
  });
  it('recursively replaces log line element by representation elements', () => {
    expect(dueLog({ line: [1, loggable([logAsArray]), 2] })).toEqual({
      line: [1, 11, 22, 33, 2],
      index: 5,
    });
  });
  it('removes log line element', () => {
    expect(dueLog({ line: [1, logAsNone, 2] })).toEqual({ line: [1, 2], index: 2 });
  });
  it('recursively removes log line element', () => {
    expect(dueLog({ line: [1, loggable(logAsNone), 2] })).toEqual({ line: [1, 2], index: 2 });
  });
  it('updates logged element', () => {
    expect(dueLog({ line: [1, logUpdater, 2] })).toEqual({ line: [1, '*', 2], index: 3 });
  });
  it('switches processed element', () => {
    expect(dueLog({ line: [logMover, logAsArray, 2] })).toEqual({
      line: [logMover, logAsArray, 2],
      index: 3,
    });
  });
  it('replaces log line', () => {
    expect(dueLog({ line: [logAsTest, logReplacer] })).toEqual({ line: [11, 22, 33], index: 3 });
  });

  function loggable(value: unknown): Loggable {
    return {
      toLog: () => value,
    };
  }
});
