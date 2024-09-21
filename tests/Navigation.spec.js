import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders navigation links', async ({ page }) => {
  await expect(page.getByText('Help Mock It')).toBeVisible();
  await expect(page.getByText('Dashboard')).toBeVisible();
  await expect(page.getByText('Endpoints')).toBeVisible();
  await expect(page.getByText('Create Endpoint')).toBeVisible();
});

test('logout button calls handleLogout', async ({ page }) => {
  await page.getByText('Logout').click();

  // Assert navigation to login page
  await expect(page).toHaveURL('/login');
});

test('active link has correct style', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.getByText('Dashboard')).toHaveClass(/border-indigo-500/);
  await expect(page.getByText('Dashboard')).toHaveClass(/text-gray-900/);

  await expect(page.getByText('Endpoints')).toHaveClass(/border-transparent/);
  await expect(page.getByText('Endpoints')).toHaveClass(/text-gray-500/);
});