import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/dashboard');
});

test('renders dashboard title', async ({ page }) => {
  await expect(page.getByTestId('Dashboard')).toBeVisible();
});

test('renders Welcome to Your Dashboard', async ({ page }) => {
  await expect(page.getByTestId('Welcome')).toBeVisible();
});

test('renders Create New Endpoint', async ({ page }) => {
  await expect(page.getByTestId('Create New Endpoint')).toBeVisible();
});