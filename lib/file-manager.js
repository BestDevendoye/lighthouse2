import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { noop } from './functional.js';

// Base directory for reports
const mkdir = (dirPath) => (fs.existsSync(dirPath) ? noop : () => fs.mkdirSync(dirPath))();
const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../reports');

export const saveReport = (dir, file, data) => {
  const dirPath = path.join(baseDir, dir);

  // Create directory if not exist
  mkdir(baseDir);
  mkdir(dirPath);

  fs.writeFileSync(path.join(baseDir, dir, `${file}.html`), data);
};
