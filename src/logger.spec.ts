import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CxBuilder, cxConstAsset } from '@proc7ts/context-builder';
import { CxGlobals } from '@proc7ts/context-values';
import { SpyInstance, spyOn } from 'jest-mock';
import { Logger } from './logger';
import { consoleLogger } from './loggers';

describe('Logger', () => {

  let cxBuilder: CxBuilder;

  beforeEach(() => {
    cxBuilder = new CxBuilder(get => ({ get }));
    cxBuilder.provide(cxConstAsset(CxGlobals, cxBuilder.context));
  });

  let logger: Logger;

  beforeEach(() => {
    logger = cxBuilder.get(Logger);
  });

  it('logs to most recent logger', () => {

    const testLogger = {
      error: jest.fn<void, unknown[]>(),
    } as Partial<Logger> as Logger;

    cxBuilder.provide(cxConstAsset(Logger, testLogger));

    const error = new Error('Test');

    logger.error('Error', error);

    expect(testLogger.error).toHaveBeenCalledWith('Error', error);
    expect(testLogger.error).toHaveBeenCalledTimes(1);
  });
  it('is singleton', () => {

    const cxBuilder2 = new CxBuilder(get => ({ get }), cxBuilder);

    expect(cxBuilder2.get(Logger)).toBe(logger);
  });

  describe('by default', () => {

    let errorSpy: SpyInstance<void, unknown[]>;

    beforeEach(() => {
      errorSpy = spyOn(consoleLogger, 'error').mockImplementation(() => void 0);
    });
    afterEach(() => {
      errorSpy.mockRestore();
    });

    it('logs to console', () => {

      const error = new Error('Test');

      logger.error('Error', error);

      expect(errorSpy).toHaveBeenCalledWith('Error', error);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('toString', () => {
    it('provides string representation', () => {
      expect(String(Logger)).toBe('[Logger]');
    });
  });
});
