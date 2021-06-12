import { describe, expect, it } from '@jest/globals';
import { dueLog } from './due-log';
import { Loggable } from './loggable';

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
    expect(dueLog({ line: [1, 2], index: 23 }, logAsTest)).toEqual({ line: [1, 2, 'test'], index: 3 });
  });

  describe('single value processing', () => {
    it('does not apply non-loggable value', () => {
      expect(dueLog({ line: [1, 2] }, 'test')).toEqual({ line: [1, 2], index: 1 });
    });
    it('appends loggable representation', () => {
      expect(dueLog({ line: [1, 2], index: 2 }, logAsTest)).toEqual({ line: [1, 2, 'test'], index: 3 });
    });
    it('replaces log line element by loggable representation', () => {
      expect(dueLog({ line: [1, 2] }, logAsTest)).toEqual({ line: ['test', 2], index: 1 });
      expect(dueLog({ line: [1, 2], index: 1 }, logAsTest)).toEqual({ line: [1, 'test'], index: 2 });
    });
    it('recursively replaces log line element by loggable representation', () => {
      expect(dueLog({ line: [1, 2] }, loggable(logAsTest))).toEqual({ line: ['test', 2], index: 1 });
      expect(dueLog({ line: [1, 2], index: 1 }, loggable(logAsTest))).toEqual({ line: [1, 'test'], index: 2 });
    });
    it('replaces log line element by representation elements', () => {
      expect(dueLog({ line: [1, 2] }, logAsArray)).toEqual({ line: [11, 22, 33, 2], index: 1 });
      expect(dueLog({ line: [1, 2], index: 1 }, logAsArray)).toEqual({ line: [1, 11, 22, 33], index: 2 });
    });
    it('recursively replaces log line element by representation elements', () => {
      expect(dueLog({ line: [1, 2] }, loggable([logAsArray]))).toEqual({ line: [11, 22, 33, 2], index: 1 });
      expect(dueLog({ line: [1, 2], index: 1 }, loggable([logAsArray]))).toEqual({ line: [1, 11, 22, 33], index: 2 });
    });
    it('removes log line element', () => {
      expect(dueLog({ line: [1, 2] }, logAsNone)).toEqual({ line: [2], index: 1 });
      expect(dueLog({ line: [1, 2], index: 1 }, logAsNone)).toEqual({ line: [1], index: 1 });
    });
    it('recursively removes log line element', () => {
      expect(dueLog({ line: [1, 2] }, loggable(logAsNone))).toEqual({ line: [2], index: 1 });
      expect(dueLog({ line: [1, 2], index: 1 }, loggable(logAsNone))).toEqual({ line: [1], index: 1 });
    });
    it('updates logged element', () => {
      expect(dueLog({ line: [1, 2] }, logUpdater)).toEqual({ line: ['*', 2], index: 1 });
      expect(dueLog({ line: [1, 2], index: 1 }, logUpdater)).toEqual({ line: [1, '*'], index: 2 });
      expect(dueLog({ line: [1, 2], index: 111 }, logUpdater)).toEqual({ line: [1, 2, '*'], index: 3 });
    });
    it('switches processed element', () => {
      expect(dueLog({ line: [logAsArray, 2] }, logMover)).toEqual({ line: [logAsArray, 2], index: 2 });
    });
    it('replaces log line', () => {
      expect(dueLog({ line: [logAsTest, 2] }, logReplacer)).toEqual({ line: [logAsArray], index: 0 });
    });
  });

  describe('line processing', () => {
    it('replaces log line', () => {
      expect(dueLog({ line: [logAsTest, logReplacer] })).toEqual({ line: [11, 22, 33], index: 3 });
    });
  });

  function loggable(value: unknown): Loggable {
    return {
      toLog: () => value,
    };
  }
});
