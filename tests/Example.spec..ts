const { test, expect } = require('@playwright/test');

test.describe('Lloyds Bank Branch Tests', () => {
  test.beforeEach(async ({ page }) => {

    await page.context().grantPermissions(['geolocation']);
   
    await page.goto('https://www.lloydsbank.com/');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearPermissions();
  });

  test('Navigate to the Lloyds Bank landing page', async ({ page }) => {
    await expect(page).toHaveURL('https://www.lloydsbank.com/');
    await expect(page).toHaveTitle('Lloyds Bank - Personal Banking, Personal Finances & Bank Accounts');
  });

  test('Search for a branch near me and handle location pop-up', async ({ page }) => {
    await page.click('input#yxt-SearchBar-input--search-bar');
    await page.fill('input#yxt-SearchBar-input--search-bar', 'Find a branch near me');
    page.once('dialog', dialog => dialog.accept());
    await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/search-results/);
  });

  test('Verify branch details', async ({ page }) => {
      const branchName = await page.textContent('.LocationName-geo'); 
    const branchAddress = await page.textContent('.Core-desktopAddress'); /
    console.log(`Branch Name: ${branchName}`);
    console.log(`Branch Address: ${branchAddress}`);
  });

  test('Verify which day of the week is marked as closed', async ({ page }) => {
    const dayRows = page.locator('.c-hours-details-row.js-day-of-week-row');
    const dayRowCount = await dayRows.count();
    for (let i = 0; i < dayRowCount; i++) {
      const status = await dayRows.nth(i).locator('.c-hours-details-row-intervals').textContent();
      if (status.trim() === 'Closed') {
        const dayOfWeek = await dayRows.nth(i).locator('.c-hours-details-row-day').textContent();
        console.log(`${dayOfWeek.trim()} is closed.`);
      }
    }
  });
});
