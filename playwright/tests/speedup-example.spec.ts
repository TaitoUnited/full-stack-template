import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('shows a not-found page for example links', async ({ page }) => {
    await page.goto('/');
    const navigationCount = await page.evaluate(
      () => performance.getEntriesByType('navigation').length
    );

    await page.getByTestId('navigation-example-page').click();

    await expect(page).toHaveTitle(/Page not found/);
    await expect(page.getByText('Page not found')).toBeVisible();
    await expect(page.getByTestId('page-topbar')).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Navigation' })
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => performance.getEntriesByType('navigation').length)
      )
      .toBe(navigationCount);
  });

  test('opens navigation in a drawer on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByLabel('Open navigation').click();

    await expect(page.getByTestId('dialog-container')).toBeVisible();
    await expect(page.getByTestId('dialog-container')).toContainText(
      'Dashboard'
    );
  });
});
