const { test, expect } = require('@playwright/test');

test.describe('Lloyds Bank Branch Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up the page context with geolocation permissions
    await page.context().grantPermissions(['geolocation']);
    // Optionally set geolocation if needed
    // await page.context().setGeolocation({ latitude: 51.509865, longitude: -0.118092 });
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
    // Use an assertion to verify that the search results page loaded
    await expect(page).toHaveURL(/search-results/);
  });

  // The following tests should ideally be separate if they are not dependent on the search test
  // If they are dependent, consider using test.step or combining into one test

  test('Verify branch details', async ({ page }) => {
    // This test assumes that clicking the "View branch" is part of the previous test
    // and it has navigated to a page showing a specific branch details
    const branchName = await page.textContent('.LocationName-geo'); // Adjust the selector if needed
    const branchAddress = await page.textContent('.Core-desktopAddress'); // Adjust the selector if needed
    console.log(`Branch Name: ${branchName}`);
    console.log(`Branch Address: ${branchAddress}`);
  });

  test('Verify which day of the week is marked as closed', async ({ page }) => {
    // This test assumes that it's on the page showing branch details with opening hours
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
