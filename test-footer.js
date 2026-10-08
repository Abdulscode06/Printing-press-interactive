const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const dPage = await desktop.newPage();
  await dPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(500);
  
  await dPage.evaluate(() => document.querySelector('#plant').scrollIntoView());
  await dPage.waitForTimeout(500);
  await dPage.screenshot({ path: path.join(screenshotDir, 'desktop-plant-footer.png'), fullPage: false });

  console.log('Final screenshots saved');
  await browser.close();
})();
