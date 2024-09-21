import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/login'); // Replace with your app's login URL
  await page.waitForSelector('input[name="username"]', { state: 'visible' }); // Wait for the element to be visible
  await page.fill('input[name="username"]', 'admin'); // Adjust selectors as needed
  await page.fill('input[name="password"]', 'Mov@72758');
  await page.click('button[type="submit"]'); // Adjust selector as needed
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;