import { expect, test } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('a local page with a Save button', async ({ page }) => {
  await page.setContent('<button onclick="document.querySelector(\'output\').textContent=\'Saved\'">Save</button><output></output>');
});

When('I save the item', async ({ page }) => {
  await page.getByRole('button', { name: 'Save' }).click();
});

Then('I see a saved confirmation', async ({ page }) => {
  await expect(page.locator('output')).toHaveText('Saved');
  await test.info().attach('confirmation', { body: 'Saved', contentType: 'text/plain' });
});

Then('I see a saved confirmation for {string}', async ({ page }, item: string) => {
  await expect(page.locator('output')).toHaveText('Saved');
  await test.info().attach('item', { body: item, contentType: 'text/plain' });
});

Then('a deliberately wrong assertion fails', async ({ page }) => {
  await expect(page.locator('output')).toHaveText('This assertion must fail', { timeout: 100 });
});

Then('the retry passes', async () => {
  expect(test.info().retry).toBeGreaterThan(0);
});

Given('this case is skipped', async () => {
  test.skip(true, 'BDD skip fixture');
});
