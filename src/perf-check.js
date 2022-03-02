const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

// Base directory for saving reports
const baseDir = path.join(__dirname, '/../reports');

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
  };
  const runnerResult = await lighthouse('https://silo.der.sn', options);
  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  // Write report to new html file
  fs.open(`${baseDir}/lhreport.html`, 'wx', async (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      await fs.writeFileSync(fileDescriptor, reportHtml);
    } else {
      console.log('Could not create new file, it may already exist!');
    }
  });
  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  await chrome.kill();
})();
