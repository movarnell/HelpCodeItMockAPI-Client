import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('renders login form', async ({ page }) => {
  await expect(page.getByLabel(/username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});

test('handles form submission successfully', async ({ page }) => {
  await page.route('**/auth/login', route => {
    route.fulfill({ json: { token: 'fake-token' } });
  });

  await page.getByLabel(/username/i).fill('testuser');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL('/dashboard');
});

test('displays error message on login failure', async ({ page }) => {
  await page.route('**/auth/login', route => {
    route.abort();
  });

  await page.getByLabel(/username/i).fill('testuser');
  await page.getByLabel(/password/i).fill('wrongpassword');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.getByText('Invalid credentials')).toBeVisible();
});