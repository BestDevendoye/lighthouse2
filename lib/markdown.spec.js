// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, expect, test, jest, beforeEach,
} from '@jest/globals';
import fs from 'fs';
import {
  extractContent,
} from './markdown.js';

// jest.mock('fs');

describe('Mardown functions', () => {
  // beforeEach(() => fs.reset());

  test('extractContent: should extract part of a file', () => {
    const spy = jest.spyOn(fs, 'readFileSync');
    spy.mockImplementation(() => 'ok');
    // text before
    // <!-- here -->
    // | Auteur | Type | Description | Lien |
    // |----|----|----|----|
    // <!-- /here -->
    // text after
    // `);

    expect(extractContent('file-path', 'here')).toEqual('ok');
    expect(fs.getLastFileCalled()).toEqual('file-path');
    expect(fs.getCalledTimes()).toEqual(1);

    spy.mockRestore();
  });
});
