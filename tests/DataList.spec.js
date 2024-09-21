import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/test_endpoint', route => {
    const mockData = [
      { data_id: 1, name: 'John Doe', age: 30 },
      { data_id: 2, name: 'Jane Smith', age: 25 },
    ];
    route.fulfill({ json: mockData });
  });

  await page.goto('/api/test_endpoint');
});

test('renders data list', async ({ page }) => {
  await expect(page.getByText('John Doe')).toBeVisible();
  await expect(page.getByText('30')).toBeVisible();
  await expect(page.getByText('Jane Smith')).toBeVisible();
  await expect(page.getByText('25')).toBeVisible();
});

test('renders add data link', async ({ page }) => {
  const addDataLink = page.getByTestId('add-data-link');
  await expect(addDataLink).toBeVisible();
  await expect(addDataLink).toHaveAttribute('href', '/api/test_endpoint/add');
});

test('displays error when fetching data fails', async ({ page }) => {
  await page.route('**/api/test_endpoint', route => {
    route.abort();
  });
  await page.reload();

  await expect(page.getByText('Failed to fetch data')).toBeVisible();
});