import { curry } from './functional.js';

// eslint-disable-next-line no-console
const toConsole = (type, feature, ...args) => console[type](`[${type}] [${feature}]`, ...args);

export default (feature) => ({
  debug: curry('debug', feature, toConsole),
  info: curry('info', feature, toConsole),
  warn: curry('warn', feature, toConsole),
  error: curry('error', feature, toConsole),
});
