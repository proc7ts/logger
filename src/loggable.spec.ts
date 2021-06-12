import { describe, expect, it } from '@jest/globals';
import { isLoggable, Loggable } from './loggable';

describe('isLoggable', () => {
  it('is `true` for loggable object', () => {

    const value: Loggable = {
      toLog: () => 'test',
    };

    expect(isLoggable(value)).toBe(true);
  });
  it('is `true` for loggable function', () => {

    const value = (): void => void 0;

    value.toLog = () => 'test';

    expect(isLoggable(value)).toBe(true);
  });
  it('is `false` for `null`', () => {
    expect(isLoggable(null)).toBe(false);
  });
  it('is `false` for `undefined`', () => {
    expect(isLoggable(undefined)).toBe(false);
  });
  it('is `false` for non-object value', () => {
    expect(isLoggable(123)).toBe(false);
  });
  it('is `false` for non-loggable object', () => {

    const value = {
      toLog: 'test',
    };

    expect(isLoggable(value)).toBe(false);
  });
});
