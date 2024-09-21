import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/endpoints/create');
});

test('renders create endpoint form', async ({ page }) => {
  await expect(page.getByLabel('Endpoint Name')).toBeVisible();
  await expect(page.getByRole('button', { name: /create endpoint/i })).toBeVisible();
});

test('submits form with endpoint data', async ({ page }) => {
  await page.route('**/endpoints', route => {
    route.fulfill({ json: { endpoint_id: 1 } });
  });

  await page.getByLabel('Endpoint Name').fill('test_endpoint');
  await page.getByRole('button', { name: /create endpoint/i }).click();

  await expect(page.route).toHaveBeenCalledWith('/endpoints', {
    endpoint_name: 'test_endpoint',
    http_methods: expect.arrayContaining(['GET', 'POST', 'PUT', 'DELETE'])
  });
});