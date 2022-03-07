/* eslint-disable no-console */
import { wait } from './functional.js';

export const cacheConsole = { lastLog: { type: null, message: null }, logs: [] };

export const consoleWaitUntil = async (regex) => {
  await wait(10);

  return cacheConsole.logs.findIndex((log) => !!log.message.match(regex)) > -1 ? true : consoleWaitUntil(regex);
};

export const mockConsole = () => ['debug', 'info', 'warn', 'error'].forEach((type) => {
  cacheConsole[type] = console[type];
  console[type] = (...args) => {
    cacheConsole.lastLog = { type, message: args.join(' ') };
    cacheConsole.logs.push(cacheConsole.lastLog);
  };
});

export const removeMockConsole = () => ['debug', 'info', 'warn', 'error'].forEach((type) => {
  console[type] = cacheConsole[type];
  cacheConsole.logs = [];
});
