import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';

const authFile = '.auth/user.json';

const readSecretSync = (filename: string) => {
  let value: string | null = null;
  try {
    value = fs.readFileSync(filename, 'utf8');
  } catch {
    // ignore error
  }
  return value;
};

const password =
  readSecretSync('/run/secrets/TEST_USER_PASSWORD') ??
  readSecretSync('../secrets/local/pge-rx-local-test.userPassword') ??
  'password';

// Setup
test('authenticate', async ({ page }) => {
  await page.goto('/');

  const loginButton = page.getByTestId('login');
  await expect(loginButton).toBeDisabled();

  await page.getByLabel('Email', { exact: true }).fill('admin@test.com');
  await expect(loginButton).toBeDisabled();

  await page.getByLabel('Password', { exact: true }).fill('invalid-password');
  await expect(loginButton).toBeEnabled();
  await loginButton.click();

  await expect(page.getByRole('alert')).toHaveText(
    'Invalid email or password.'
  );

  await page.getByLabel('Password', { exact: true }).fill(password);
  await expect(page.getByRole('alert')).toBeHidden();
  await loginButton.click();

  // Check that entering app was successful
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Save browser state for reusing auth
  await page.context().storageState({ path: authFile });
});
