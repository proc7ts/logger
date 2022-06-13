import { describe, expect, it, jest } from '@jest/globals';
import { Loggable } from '../loggable/mod.js';
import { Logger } from '../logger.js';
import { processingLogger } from './processing-logger.js';

describe('processingLogger', () => {
  it('processes loggable values', () => {

    const logger = {
      error: jest.fn(),
    } as Partial<Logger> as Logger;
    const processing = processingLogger(logger, { on: 'in' });
    const loggable1: Loggable = {
      toLog: ({ on = 'in' }) => on === 'in' ? 'logged-in' : undefined,
    };
    const loggable2: Loggable = {
      toLog: ({ on = 'out' }) => on === 'out' ? 'logged-out' : undefined,
    };

    processing.error(1, loggable1, loggable2, 2);
    expect(logger.error).toHaveBeenCalledWith(1, 'logged-in', loggable2, 2);
  });
});
