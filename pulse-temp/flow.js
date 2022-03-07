export const name = 'Pulse Recette';

export const viewport = { width: 1350, height: 940 };
export const settings = {
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  },
  formFactor: 'desktop',
};

export const flow = async ({ info, debug }, lighthouse, page) => {
  const { PULSE_URL, PULSE_USERNAME, PULSE_PASSWORD } = process.env;

  info('Start testing flow...');
  debug('URL', PULSE_URL);
  // await lighthouse.navigate(URL);
  await page.goto(PULSE_URL);
  await page.waitForNavigation();

  info('Login page...');
  await lighthouse.startTimespan({ stepName: 'Login to app.' });
  await page.waitForSelector(
    '#gigya-login-form > div.gigya-layout-row.with-divider > div.gigya-layout-cell.responsive.with-social-login >'
    + ' div.gigya-composite-control.gigya-composite-control-submit > input',
  );

  const usernameInput = await page.waitForSelector('#gigya-loginID-150696239215367460');
  const passwordInput = await page.waitForSelector('#gigya-password-133998829220161280');
  const submitInput = await page.waitForSelector(
    '#gigya-login-form > div.gigya-layout-row.with-divider > div.gigya-layout-cell.responsive.with-social-login > '
    + 'div.gigya-composite-control.gigya-composite-control-submit > input',
  );

  // Fill in the username, password and submit login form.
  await usernameInput.type(PULSE_USERNAME);
  await passwordInput.type(PULSE_PASSWORD);
  await submitInput.click();
  await lighthouse.endTimespan();
  await lighthouse.snapshot({ stepName: 'Login to app.' });
  info('Successfully login to app...');

  info('Going to document page...');
  await lighthouse.startTimespan({ stepName: 'Go to documents menu' });

  let element = await page.waitForSelector(
    '#single-spa-application\\:\\@kpmg\\/mypulse-navbar > div > div > div.navbar-menu > ul > li:nth-child(2)',
  );
  await element.click();
  // await page.waitForNavigation();

  await page.waitForSelector(
    '#single-spa-application\\:\\@kpmg\\/mypulse-natto > div > div > div.main-view > '
    + 'div.basic-layout.main-view-layout > '
    + 'div.basic-layout__content > div > div.listview > div > div.mp-in-card.trash-card',
  );

  await lighthouse.endTimespan();
  await lighthouse.snapshot({ stepName: 'Go to documents menu' });
  info('Document page successfully loaded...');

  info('Starting filter search...');
  await lighthouse.startTimespan({ stepName: 'Filter search (last 30 days)' });

  element = await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/mypulse-natto"]/div/div/div[1]/div[1]/div[2]/'
    + 'div/div[1]/section/div[1]/div[2]/button',
  );
  await element.click();
  await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/mypulse-natto"]/div/div/div[1]/div[1]/div[2]/'
    + 'div/div[1]/section/div[1]/div[2]/button',
  );

  element = await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/mypulse-natto"]/div/div/div[1]/div[1]/div[2]/'
    + 'div/div[1]/section/div[2]/div[1]/div/div/div[1]/div[2]/div/div/input',
  );
  await page.waitForTimeout(3000);
  await element.click();
  await page.waitForTimeout(3000);
  const selectElement = await page.waitForXPath('/html/body/div[7]/div[1]/div/div[1]/ul/li[4]');
  await selectElement.click();
  const validateElement = await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/mypulse-natto"]/div/div/div[1]/div[1]/div[2]/'
    + 'div/div[1]/section/div[2]/div[2]/button[2]',
  );
  await validateElement.click();
  await page.waitForTimeout(3000);
  await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/mypulse-natto"]/div/div/div[1]/div[1]/div[2]/'
    + 'div/div[1]/section/div[2]/div[1]/div/div/div[1]/div[2]/div/div/input',
  );

  await lighthouse.endTimespan();
  await lighthouse.snapshot({ stepName: 'Filter search (last 30 days)' });
  info('Search result successfully showed...');

  info('Going to Battec entities...');
  await lighthouse.startTimespan({ stepName: 'Go to Battec entitie' });

  element = await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/mypulse-navbar"]/div/div/div[1]',
  );
  await element.click();
  await page.waitForTimeout(3000);

  element = await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/setting"]/div/div/div[1]/div/div[3]/'
    + 'div/div[34]/div/div/div/div[2]/div[1]/button',
  );
  await element.click();
  await page.waitForTimeout(3000);
  await page.waitForXPath(
    '//*[@id="single-spa-application:@kpmg/setting"]/div/div/div[1]/div/div[3]/div/div[34]/div/div',
  );
  await lighthouse.endTimespan();
  await lighthouse.snapshot({ stepName: 'Go to Battec entitie' });
  info('Done going to battec entities...');

  info('Going to indicator result...');
  await lighthouse.startTimespan({ stepName: 'Show indicator page' });

  element = await page.waitForSelector(
    '#single-spa-application\\:\\@kpmg\\/mypulse-navbar > div > div > '
    + 'div.navbar-menu > ul > li:nth-child(3)',
  );
  await element.click();
  await page.waitForSelector(
    '#single-spa-application\\:\\@kpmg\\/mypulse-navbar > div > div > '
    + 'div.navbar-menu > ul > li:nth-child(3)',
  );

  await page.waitForTimeout(5000);

  await lighthouse.endTimespan();
  await lighthouse.snapshot({ stepName: 'Show indicator page' });
  info('Indicator page successfully showed...');
};