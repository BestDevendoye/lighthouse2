const readline = require('readline');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { saveReport } = require('../lib/fileManager.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter the url you want to check > ',
});

(async () => {
  let checkUrl = '';
  rl.prompt();
  await rl.on('line', async (str) => {
    checkUrl = str;
    rl.close();
    // perform the check
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance'],
      port: chrome.port,
    };
    const runnerResult = await lighthouse(checkUrl, options);
    const reportFolder = checkUrl.split('//')[1];
    const fileName = new Date().toUTCString();
    // `.report` is the HTML report as a string
    const reportHtml = runnerResult.report;
    // Write report to new html file
    await saveReport(reportFolder, fileName, reportHtml, (err) => {
      console.log(err);
    });

    // `.lhr` is the Lighthouse Result as a JS object
    console.log('Report is done for', runnerResult.lhr.finalUrl);
    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
    await chrome.kill();
  });
})();
