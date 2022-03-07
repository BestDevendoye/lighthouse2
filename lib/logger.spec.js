// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, test } from '@jest/globals';
import logger from './logger.js';
import { mockConsole, removeMockConsole, cacheConsole } from './console-mock.js';

describe('Logger library', () => {
  test('logger: should log with the type and feature', () => {
    mockConsole();

    const log = logger('my feature');

    ['debug', 'info', 'warn', 'error'].forEach((type) => {
      expect(typeof log[type]).toEqual('function');

      log[type]('hello world');

      expect(cacheConsole.lastLog.type).toEqual(type);
      expect(cacheConsole.lastLog.message).toEqual(`[${type}] [my feature] hello world`);
    });

    removeMockConsole();
  });
});
