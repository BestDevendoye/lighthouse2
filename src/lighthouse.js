import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { saveReport } from '../lib/file-manager.js';
import logger from '../lib/logger.js';

const { info } = logger('Perf Check');
const checkUrl = process.argv[process.argv.length - 1];
const reportName = () => new Date()
  .toISOString()
  .replace(/:/g, '')
  .replace(/\..*?$/, '')
  .replace('T', '_');

// perform the check
(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const runnerResult = await lighthouse(checkUrl, {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  });

  // Write report to new html file
  saveReport(checkUrl.split('//')[1], reportName(), runnerResult.report);

  // `.lhr` is the Lighthouse Result as a JS object
  info('Report is done for', runnerResult.lhr.finalUrl);
  info('Performance score was', runnerResult.lhr.categories.performance.score * 100);

  await chrome.kill();
})();
