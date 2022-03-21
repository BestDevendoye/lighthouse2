import 'dotenv/config.js';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api.js';
import { noop, job, cond } from '../lib/functional.js';
import logger from '../lib/logger.js';
import { generatedReport } from '../config/flow.js';

const DEBUG = process.env.LIGHTHOUSE_DEBUG === 'true';
const HEADLESS = process.env.LIGHTHOUSE_HEADLESS !== 'false';
const FLOW_CONFIG_PATH = path.join('..', process.env.LIGHTHOUSE_FLOW_CONFIG_PATH || './config/flow.js')
  .replace(/\\/g, '/');
const OUTPUT = path.resolve(process.env.LIGHTHOUSE_OUTPUT || './reports');

const log = logger('Lighthouse', DEBUG);
const { info, debug, error } = log;
const reportDate = () => new Date()
  .toISOString()
  .replace(/:/g, '')
  .replace(/\..*?$/, '')
  .replace('T', '_');
const mkdir = (dirPath) => (fs.existsSync(dirPath) ? noop : () => fs.mkdirSync(dirPath))();

let browser;

job(log, async () => {
  info('Loading configuration...');
  debug('DEBUG:', DEBUG);
  debug('FLOW_CONFIG_PATH:', FLOW_CONFIG_PATH);
  debug('OUTPUT:', OUTPUT);
  error('OUTPUT:', OUTPUT);

  const { name, settings, flow } = await import(FLOW_CONFIG_PATH);

  info(`Start scanning ${name}...`);
  browser = await puppeteer.launch({ headless: HEADLESS });
  const page = await browser.newPage();

  const lighthouse = await startFlow(page, { name, configContext: { settingsOverrides: settings } });

  await page.setViewport({ width: 1350, height: 940 });

  await flow(log, lighthouse, page, browser);

  mkdir(OUTPUT);

  const reportNameTmp = `${generatedReport}-${reportDate()}`;
  const reportFileName = reportNameTmp.replace(' ', '-').toLowerCase();

  info(`Generating the report ${reportFileName}`);
  fs.writeFileSync(`${OUTPUT}/${reportFileName}.html`, lighthouse.generateReport());
  fs.writeFileSync(`${OUTPUT}/${reportFileName}.json`, JSON.stringify(lighthouse.getFlowResult(), null, 2));
}, async () => {
  await cond(browser, () => browser.close());

  info('[DONE]');
})(DEBUG);
