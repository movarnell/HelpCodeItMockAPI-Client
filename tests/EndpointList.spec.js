import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Mock API response
  await page.route('**/api/endpoints', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { endpoint_id: 1, endpoint_name: 'users', http_methods: ['GET', 'POST'] },
        { endpoint_id: 2, endpoint_name: 'products', http_methods: ['GET'] },
      ]),
    });
  });

  await page.goto('/endpoints');
});

test('renders EndpointList component', async ({ page }) => {
  await expect(page.getByText('Endpoint List')).toBeVisible();
  await expect(page.getByText('users')).toBeVisible();
  await expect(page.getByText('products')).toBeVisible();
});

test('navigates back to dashboard when back arrow is clicked', async ({ page }) => {
  const backArrow = page.getByTestId('back-arrow');
  await backArrow.click();
  await expect(page).toHaveURL('/dashboard');
});