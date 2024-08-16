import { test, expect, Page } from '@playwright/test';

/**
 * Initial page-load of SPA application with goto() might be slow,
 * especially in Vite dev mode which loads each source file seperately.
 * Thus when doing smalls tests on many separate pages it might be
 * worthwhile to reuse the page session and navigate using links inside
 * the application.
 */
test.describe.serial('Main pages', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    page.goto('');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('unit subpages', async () => {
    await page.getByRole('link', { name: 'Blog' }).click();
    await expect(page.getByText('New post')).toBeVisible();
  });

  test('cycle base subpages', async () => {
    await page.getByRole('link', { name: 'Theming' }).click();
    await expect(page.getByText('Success alert message')).toBeVisible();
  });
});
