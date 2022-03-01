import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { noop, capitalize } from './functional.js';

export const resolve = (...dirs) => path.join(path.dirname(fileURLToPath(import.meta.url)), '..', ...dirs);
export const mkdir = (dir) => (fs.existsSync(dir) ? noop : () => fs.mkdirSync(dir));

export const loadTemplate = (name, renderData) => {
  const content = fs.readFileSync(resolve(`templates/${name}.pptx`), 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(renderData);

  return doc;
};
export const pptxExists = (name, output) => fs.existsSync(resolve(output, `${name}.pptx`));
export const writePptx = (name, output) => (doc) => {
  const buffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(resolve(output, `${name}.pptx`), buffer);
};

export const previousMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);

  return date;
};

export const enDate = () => previousMonth().toISOString().replace(/-\d+T.*?$/, '');
export const frDate = () => `${
  capitalize(previousMonth().toLocaleString('default', { month: 'long' }))
} ${
  previousMonth().getFullYear()
}`;

export const reportName = (name) => `${name} ${enDate()}`;
