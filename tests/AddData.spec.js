import { test, expect } from '@playwright/test';

test.describe('AddData Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock endpoints request
    await page.route('**/endpoints', route => {
      route.fulfill({ json: [{ endpoint_id: 1, endpoint_name: 'test_endpoint' }] });
    });

    // Mock fields request
    await page.route('**/endpoints/1/fields', route => {
      const mockFields = [
        { field_id: 1, field_name: 'name', data_type: 'STRING', is_required: true },
        { field_id: 2, field_name: 'age', data_type: 'INT', is_required: false },
      ];
      route.fulfill({ json: mockFields });
    });

    await page.goto('/api/test_endpoint/add');
    await page.waitForLoadState('networkidle');
  });

  test('renders add data form', async ({ page }) => {
    await expect(page.getByTestId('Add Data to {endpointName}')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('Form Input')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('JSON Input')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('Add Data')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('Back to Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('submits form with data', async ({ page }) => {
    await page.route('**/api/test_endpoint', route => {
      route.fulfill({
        json: { id: 1 },
        status: 200
      });
    });

    await page.getByTestId('name').fill('Test Name');
    await page.getByTestId('age').fill('25');
    await page.getByTestId('Add Data').click();

    // Assert that navigation occurred
    await expect(page).toHaveURL('/api/test_endpoint', { timeout: 10000 });
  });

  test('displays error when fetching fields fails', async ({ page }) => {
    await page.route('**/endpoints/1/fields', route => {
      route.abort();
    });

    await page.reload();

    // Assert that the error message is displayed
    await expect(page.getByText('Failed to fetch fields')).toBeVisible({ timeout: 10000 });
  });

  test('displays error when form submission fails', async ({ page }) => {
    await page.route('**/api/test_endpoint', route => {
      route.abort();
    });

    await page.getByTestId('name').fill('Test Name');
    await page.getByTestId('age').fill('25');
    await page.getByTestId('Add Data').click();

    // Assert that the error message is shown
    await expect(page.getByText('Failed to add data')).toBeVisible({ timeout: 10000 });
  });


});
