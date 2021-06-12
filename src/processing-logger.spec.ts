import { describe, expect, it, jest } from '@jest/globals';
import { Loggable } from './loggable';
import { Logger } from './logger';
import { processingLogger } from './processing-logger';

describe('processingLogger', () => {
  it('processes loggable values', () => {

    const logger = {
      error: jest.fn(),
    } as Partial<Logger> as Logger;
    const processing = processingLogger(logger);
    const loggable: Loggable = {
      toLog: () => 'logged',
    };

    processing.error(1, loggable, 2, 3);
    expect(logger.error).toHaveBeenCalledWith(1, 'logged', 2, 3);
  });
});
