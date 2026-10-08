const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  // Mobile 390px
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const mPage = await mobile.newPage();
  await mPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(500);
  
  // Scroll to portfolio section
  await mPage.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
  await mPage.waitForTimeout(500);
  await mPage.screenshot({ path: path.join(screenshotDir, 'mobile-portfolio.png'), fullPage: false });

  // Desktop 1440px
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const dPage = await desktop.newPage();
  await dPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(500);
  
  // Scroll to portfolio
  await dPage.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
  await dPage.waitForTimeout(500);
  await dPage.screenshot({ path: path.join(screenshotDir, 'desktop-portfolio.png'), fullPage: false });

  console.log('Portfolio screenshots saved');
  await browser.close();
})();
