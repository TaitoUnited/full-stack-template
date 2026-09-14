import { test, expect } from '@playwright/test';

test('shows the dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
