import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Logger } from '../logger.js';
import { proxyLogger } from './proxy-logger.js';

describe('proxyLogger', () => {

  let proxied: Logger;
  let proxied1: Logger;
  let proxied2: Logger;
  let proxy: Logger;

  beforeEach(() => {
    proxied1 = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    };
    proxied2 = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    };
    proxied = proxied1;
    proxy = proxyLogger(() => proxied);
  });

  describe('error', () => {
    it('proxies log messages', () => {
      proxy.error(1, 2);
      expect(proxied1.error).toHaveBeenCalledWith(1, 2);

      proxied = proxied2;
      proxy.error(3, 4);
      expect(proxied2.error).toHaveBeenCalledWith(3, 4);

      expect(proxied1.error).toHaveBeenCalledTimes(1);
      expect(proxied2.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn', () => {
    it('proxies log messages', () => {
      proxy.warn(1, 2);
      expect(proxied1.warn).toHaveBeenCalledWith(1, 2);

      proxied = proxied2;
      proxy.warn(3, 4);
      expect(proxied2.warn).toHaveBeenCalledWith(3, 4);

      expect(proxied1.warn).toHaveBeenCalledTimes(1);
      expect(proxied2.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('info', () => {
    it('proxies log messages', () => {
      proxy.info(1, 2);
      expect(proxied1.info).toHaveBeenCalledWith(1, 2);

      proxied = proxied2;
      proxy.info(3, 4);
      expect(proxied2.info).toHaveBeenCalledWith(3, 4);

      expect(proxied1.info).toHaveBeenCalledTimes(1);
      expect(proxied2.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('debug', () => {
    it('proxies log messages', () => {
      proxy.debug(1, 2);
      expect(proxied1.debug).toHaveBeenCalledWith(1, 2);

      proxied = proxied2;
      proxy.debug(3, 4);
      expect(proxied2.debug).toHaveBeenCalledWith(3, 4);

      expect(proxied1.debug).toHaveBeenCalledTimes(1);
      expect(proxied2.debug).toHaveBeenCalledTimes(1);
    });
  });

  describe('trace', () => {
    it('proxies log messages', () => {
      proxy.trace(1, 2);
      expect(proxied1.trace).toHaveBeenCalledWith(1, 2);

      proxied = proxied2;
      proxy.trace(3, 4);
      expect(proxied2.trace).toHaveBeenCalledWith(3, 4);

      expect(proxied1.trace).toHaveBeenCalledTimes(1);
      expect(proxied2.trace).toHaveBeenCalledTimes(1);
    });
  });

});
