// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, test } from '@jest/globals';
import {
  noop,
  always,
  cond,
  capitalize,
  curry,
  job,
  wait,
  errorWhen,
} from './functional.js';

describe('Functional helpers', () => {
  test('noop: should do nothing', () => {
    expect(noop()).toBeUndefined();
  });

  test('always: should return the same value', () => {
    expect(always('abc')()).toEqual('abc');
  });

  test('cond: should execute functions compared to the value entered', () => {
    expect(cond(true, () => 'good value')).toEqual('good value');
    expect(cond(true, () => 'good value', () => 'bad value')).toEqual('good value');
    expect(cond(false, () => 'good value')).toBeUndefined();
    expect(cond(false, () => 'good value', () => 'bad value')).toEqual('bad value');
  });

  test('capitalize: should capitalize sentence', () => {
    expect(capitalize('hello world')).toEqual('Hello world');
    expect(capitalize('HELLO WORLD')).toEqual('HELLO WORLD');
  });

  test('wait: should wait 1ms', async () => {
    let progress = 0;

    await (async () => {
      await wait(1);
      progress += 1;
    })();

    expect(progress).toEqual(1);
  });

  test('curry: should curry functions', () => {
    const fn = (a, b, c) => `${a}, ${b}, ${c}`;

    expect(curry('hello', fn)()).toEqual('hello, undefined, undefined');
    expect(curry('hello', fn)('world', 'everybody')).toEqual('hello, world, everybody');
    expect(curry('hello', 'world', fn)('everybody')).toEqual('hello, world, everybody');
  });

  test('job: should execute an async job function', async () => {
    let err = null;
    const log = {
      error: (message) => {
        err = message;
      },
    };
    let progress = 0;

    await (job(log, async () => {
      await wait(1);
      progress += 1;
    })());

    expect(err).toBeNull();
    expect(progress).toEqual(1);

    progress = 0;

    await (job(log, async () => {
      await wait(1);
      progress += 1;
    }, async () => {
      await wait(1);
      progress += 1;
    })());

    expect(err).toBeNull();
    expect(progress).toEqual(2);

    progress = 0;

    await (job(log, async () => {
      await wait(1);

      await (async () => {
        throw new Error('wrong');
      })();

      progress += 1;
    }, async () => {
      await wait(1);
      progress += 1;
    })());

    expect(err).toEqual('wrong');
    expect(progress).toEqual(1);
  });

  test('errorWhen: should throw an error', () => {
    let progress = null;

    try {
      errorWhen(true, 'wrong');
    } catch (err) {
      progress = err.message;
    }

    expect(progress).toEqual('wrong');

    progress = null;

    try {
      errorWhen(false, 'wrong');
    } catch (err) {
      progress = err.message;
    }

    expect(progress).toBeNull();
  });
});
