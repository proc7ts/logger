import { describe, expect, it } from '@jest/globals';
import { silentLogger } from './silent-logger';

describe('silentLogger', () => {
  describe('error', () => {
    it('logs nothing', () => {
      // noinspection JSVoidFunctionReturnValueUsed
      expect(silentLogger.error('message')).toBeUndefined();
    });
  });

  describe('warn', () => {
    it('logs nothing', () => {
      expect(silentLogger.warn).toBe(silentLogger.error);
    });
  });

  describe('info', () => {
    it('logs nothing', () => {
      expect(silentLogger.info).toBe(silentLogger.error);
    });
  });

  describe('debug', () => {
    it('logs nothing', () => {
      expect(silentLogger.debug).toBe(silentLogger.error);
    });
  });

  describe('trace', () => {
    it('logs nothing', () => {
      expect(silentLogger.trace).toBe(silentLogger.error);
    });
  });
});
