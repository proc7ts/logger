import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Loggable } from '../loggable/mod.js';
import { consoleLogger } from './console-logger.js';

describe('consoleLogger', () => {
  let logSpy: jest.Mock<(...args: unknown[]) => void>;

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe('error', () => {
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        /* do not log */
      }) as typeof logSpy;
    });

    it('logs message to console', () => {
      consoleLogger.error('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%s', 'message', 1, 2, 3);
    });
    it('logs object to console', () => {
      const object = { name: 'test' };

      consoleLogger.error(object, 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith(object, 1, 2, 3);
    });
    it('logs `undefined` to console', () => {
      consoleLogger.error(undefined);
      expect(logSpy).toHaveBeenCalledWith(undefined);
    });
    it('logs empty message to console', () => {
      consoleLogger.error();
      expect(logSpy).toHaveBeenCalledWith(...([] as unknown[] as [unknown, ...unknown[]]));
    });
    it('processes loggable values', () => {
      const loggable: Loggable = {
        toLog() {
          return 'replacement';
        },
      };

      consoleLogger.error(loggable, 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%s', 'replacement', 1, 2, 3);
    });
  });

  describe('warn', () => {
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        /* do not log */
      }) as typeof logSpy;
    });

    it('logs message to console', () => {
      consoleLogger.warn('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%s', 'message', 1, 2, 3);
    });
    it('logs object to console', () => {
      const object = { name: 'test' };

      consoleLogger.warn(object, 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith(object, 1, 2, 3);
    });
    it('logs `undefined` to console', () => {
      consoleLogger.warn(undefined);
      expect(logSpy).toHaveBeenCalledWith(undefined);
    });
    it('logs empty message to console', () => {
      consoleLogger.warn();
      expect(logSpy).toHaveBeenCalledWith(...([] as unknown[] as [unknown, ...unknown[]]));
    });
  });

  describe('info', () => {
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'info').mockImplementation(() => {
        /* do not log */
      }) as typeof logSpy;
    });

    it('logs message to console', () => {
      consoleLogger.info('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%s', 'message', 1, 2, 3);
    });
    it('logs object to console', () => {
      const object = { name: 'test' };

      consoleLogger.info(object, 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith(object, 1, 2, 3);
    });
    it('logs `undefined` to console', () => {
      consoleLogger.info(undefined);
      expect(logSpy).toHaveBeenCalledWith(undefined);
    });
    it('logs empty message to console', () => {
      consoleLogger.info();
      expect(logSpy).toHaveBeenCalledWith(...([] as unknown[] as [unknown, ...unknown[]]));
    });
  });

  describe('debug', () => {
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'debug').mockImplementation(() => {
        /* do not log */
      }) as typeof logSpy;
    });

    it('logs message to console', () => {
      consoleLogger.debug('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%s', 'message', 1, 2, 3);
    });
    it('logs object to console', () => {
      const object = { name: 'test' };

      consoleLogger.debug(object, 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith(object, 1, 2, 3);
    });
    it('logs `undefined` to console', () => {
      consoleLogger.debug(undefined);
      expect(logSpy).toHaveBeenCalledWith(undefined);
    });
    it('logs empty message to console', () => {
      consoleLogger.debug();
      expect(logSpy).toHaveBeenCalledWith(...([] as unknown[] as [unknown, ...unknown[]]));
    });
  });

  describe('trace', () => {
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'trace').mockImplementation(() => {
        /* do not log */
      }) as typeof logSpy;
    });

    it('logs message to console', () => {
      consoleLogger.trace('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%s', 'message', 1, 2, 3);
    });
    it('logs object to console', () => {
      const object = { name: 'test' };

      consoleLogger.trace(object, 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith(object, 1, 2, 3);
    });
    it('logs `undefined` to console', () => {
      consoleLogger.trace(undefined);
      expect(logSpy).toHaveBeenCalledWith(undefined);
    });
    it('logs empty message to console', () => {
      consoleLogger.trace();
      expect(logSpy).toHaveBeenCalledWith(...([] as unknown[] as [unknown, ...unknown[]]));
    });
  });
});
