import fs from 'fs';
import { always } from './functional.js';

export const extractContent = (filePath, commentName) => {
  let content = fs.readFileSync(filePath, 'utf8');
  ([, content] = content.split(`<!-- ${commentName} -->`));
  ([content] = content.split(`<!-- /${commentName} -->`));

  return content.split('\n').filter((line) => !!line.trim());
};

export const linesInTable = (filePath, commentName, mapFn) => extractContent(filePath, commentName)
  .filter((line, i) => i > 1 && line.charAt(0) === '|')
  .map((line) => (mapFn || always)(line.trim())());

export const linesInList = (filePath, commentName, mapFn) => extractContent(filePath, commentName)
  .filter((line) => line.charAt(0) === '*' || line.charAt(0) === '-')
  .map((line) => (mapFn || always)(line.trim().replace(/^(-|\*)\s?/, ''))());
