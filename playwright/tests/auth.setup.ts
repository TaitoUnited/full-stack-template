import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';

const authFile = '.auth/user.json';

const readSecretSync = (filename: string) => {
  let value: string | null = null;
  try {
    value = fs.readFileSync(filename, 'utf8');
  } catch (err) {
    // ignore error
  }
  return value;
};

const password =
  readSecretSync('/run/secrets/TEST_USER_PASSWORD') ??
  readSecretSync(
    '../secrets/local/full-stack-template-local-test.userPassword'
  );

setup('authenticate', async ({ page }) => {
  // Check that password was found
  // expect(password).not.toBeFalsy();

  await page.goto('/');

  // Template has no auth checking
  await page.getByLabel('Email', { exact: true }).fill('admin@test.com');
  await page.getByLabel('Password', { exact: true }).fill('password');
  await page.getByTestId('login').click();

  // Check that entering app was successful
  await expect(
    page.getByText('Taito Fullstack Template').first()
  ).toBeVisible();

  // Save browser state for reusing auth
  await page.context().storageState({ path: authFile });
});
