/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, test } from '@jest/globals';
import { wait } from './functional.js';
import {
  cacheConsole, consoleWaitUntil, mockConsole, removeMockConsole,
} from './console-mock.js';

describe('Console mock lib', () => {
  test('mockConsole: should mock and catch the console messages', () => {
    mockConsole();

    console.info('[info] [mock] hello world');
    console.info('[info] [mock] hello world 2');

    expect(cacheConsole.logs).toEqual([
      { type: 'info', message: '[info] [mock] hello world' },
      { type: 'info', message: '[info] [mock] hello world 2' },
    ]);
    expect(cacheConsole.lastLog).toEqual({ type: 'info', message: '[info] [mock] hello world 2' });

    removeMockConsole();

    expect(cacheConsole.logs).toEqual([]);
    expect(cacheConsole.lastLog).toEqual({ type: 'info', message: '[info] [mock] hello world 2' });
  });
  test('consoleWaitUntil: should wait a specific console message', async () => {
    mockConsole();

    (async () => {
      await wait(20);
      console.info('[info] [mock] hello world');
    })();

    console.info('[info] [mock] message 2');

    await consoleWaitUntil(/hello world/);

    expect(cacheConsole.logs).toEqual([
      { type: 'info', message: '[info] [mock] message 2' },
      { type: 'info', message: '[info] [mock] hello world' },
    ]);
    expect(cacheConsole.lastLog).toEqual({ type: 'info', message: '[info] [mock] hello world' });

    removeMockConsole();
  });
});
