import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { SpyInstance } from 'jest-mock';
import { consoleLogger } from './console-logger';

describe('consoleLogger', () => {

  let logSpy: SpyInstance<void, unknown[]>;

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe('error', () => {

    beforeEach(() => {
      logSpy = jest.spyOn(console, 'error').mockImplementation(() => { /* do not log */ });
    });

    it('logs to console', () => {
      consoleLogger.error('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%O', 'message', 1, 2, 3);
    });
    it('logs empty message to console', () => {
      consoleLogger.error();
      expect(logSpy).toHaveBeenCalledWith();
    });
  });

  describe('warn', () => {

    beforeEach(() => {
      logSpy = jest.spyOn(console, 'warn').mockImplementation(() => { /* do not log */ });
    });

    it('logs to console', () => {
      consoleLogger.warn('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%O', 'message', 1, 2, 3);
    });
    it('logs empty message to console', () => {
      consoleLogger.warn();
      expect(logSpy).toHaveBeenCalledWith();
    });
  });

  describe('info', () => {

    beforeEach(() => {
      logSpy = jest.spyOn(console, 'info').mockImplementation(() => { /* do not log */ });
    });

    it('logs to console', () => {
      consoleLogger.info('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%O', 'message', 1, 2, 3);
    });
    it('logs empty message to console', () => {
      consoleLogger.info();
      expect(logSpy).toHaveBeenCalledWith();
    });
  });

  describe('debug', () => {

    beforeEach(() => {
      logSpy = jest.spyOn(console, 'debug').mockImplementation(() => { /* do not log */ });
    });

    it('logs to console', () => {
      consoleLogger.debug('message', 1, 2, 3);
      expect(logSpy).toHaveBeenCalledWith('%O', 'message', 1, 2, 3);
    });
    it('logs empty message to console', () => {
      consoleLogger.debug();
      expect(logSpy).toHaveBeenCalledWith();
    });
  });

});
