import fs from 'fs';
import path from 'path';
import { noop } from './functional.js';

// Base directory for reports
const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../reports');

export const saveReport = (dir, file, data) => {
  const dirPath = path.join(baseDir, dir);

  // Create directory if not exist
  (fs.existsSync(dirPath), noop, () => fs.mkdirSync(dirPath))();

  fs.writeFileSync(path.join(baseDir, dir, `${file}.html`), data);
};
