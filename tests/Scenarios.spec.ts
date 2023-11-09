
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Launch the browser
  const context = await browser.newContext({
    permissions: ['geolocation']
  });
  const page = await context.newPage(); // Open a new page

  // Step 1: Navigate to the URL
  await page.goto('https://www.lloydsbank.com/');
  await page.waitForTimeout(3000); 
  console.log('Step 1: Launched landing page');
  
  // Step 2: Check if you are on the correct page by checking the title
  const title = await page.title();
  if (title === 'Lloyds Bank - Personal Banking, Personal Finances & Bank Accounts') {
    console.log(`Step 2: Title is matching as ${title}.`); 
  } else {
    throw new Error('Not on the correct page.');
  }
  
// Click on the search bar and enter text
await page.click('input#yxt-SearchBar-input--search-bar'); 
await page.fill('input#yxt-SearchBar-input--search-bar', 'Find a branch near me'); 
await page.keyboard.press('Enter'); 
//for handling location pop-up
context.on('dialog', async (dialog) => {
  await dialog.accept();
  });
  console.log('Step 3 : Location pop allowed');
//Accept cookies
await page.getByRole('button', { name: 'Accept all' }).click();

  // Steps 4: Validate if you have arrived on the correct page 
  const title2 = await page.title();
  if (title2 === 'Search Results | Lloyds Bank') {
    console.log(`Step 4: Title is matching as ${title2}.`);
  } else {
    throw new Error('Not on the correct page.');
  } 
  // Step 5: Click on "View branch"
  await page.frameLocator('iframe#answers-frame').getByRole('link', { name: 'View branch' }).first().click();
     console.log('Step 5: Clicked on the first branch.');
 
  // Step 6: Verify branch details
  const branchloc = await page.locator('.LocationName-geo'); 
  const branchName = await branchloc.textContent();
  
  const branchadd = await page.locator('.Core-desktopAddress'); 
  const branchAddress = await branchadd.textContent();

  console.log(`Step 6.1: Branch Name: ${branchName}`);
  console.log(`Step 6.2: Branch Address: ${branchAddress}`);

// Select all the rows in the table with the days of the week
  const dayRows = page.locator('.c-hours-details-row.js-day-of-week-row');

  // Get the count of day rows
  const dayRowCount = await dayRows.count();

  // Iterate over each row to check the day status
  for (let i = 0; i < dayRowCount; i++) {
    const dayRow = dayRows.nth(i);
    const status = await dayRow.locator('.c-hours-details-row-intervals').textContent();

    // Check if the status contains "Closed"
    if (status.trim() === 'Closed') {
      // If it is closed, get the day of the week
      const dayOfWeek = await dayRow.locator('.c-hours-details-row-day').textContent();
      console.log(`Step 6.3: ${dayOfWeek.trim()} is closed.`);
    }
  }
   await browser.close(); // Close the browser
})();
