import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { saveReport } from '../lib/file-manager.js';

const checkUrl = process.argv[process.argv.length - 1];

// perform the check
(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const runnerResult = await lighthouse(checkUrl, {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  });

  const reportFolder = checkUrl.split('//')[1];
  const fileName = new Date().toUTCString();
  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  // Write report to new html file
  saveReport(reportFolder, fileName, reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

  await chrome.kill();
})();
