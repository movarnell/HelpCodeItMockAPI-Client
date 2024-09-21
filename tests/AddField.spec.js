import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Mock the fields endpoint
  await page.route('**/endpoints/1/fields', route => {
    const mockFields = [
      { id: 1, field_name: 'name', data_type: 'VARCHAR', is_required: true },
      { id: 2, field_name: 'age', data_type: 'INT', is_required: false },
    ];
    route.fulfill({ json: { fields: mockFields } });
  });

  await page.goto('/endpoints/1/fields/add');
});

test('renders AddField component', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /add field/i })).toBeVisible();
  await expect(page.getByLabel(/field name/i)).toBeVisible();
  await expect(page.getByLabel(/data type/i)).toBeVisible();
  await expect(page.getByLabel(/is required/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /add field/i })).toBeVisible();
});

test('submits form successfully', async ({ page }) => {
  await page.route('**/endpoints/1/fields', route => {
    route.fulfill({
      json: { message: 'Field added successfully' },
      status: 200
    });
  });

  await page.getByLabel(/field name/i).fill('email');
  await page.getByLabel(/data type/i).selectOption('VARCHAR');
  await page.getByLabel(/is required/i).check();
  await page.getByRole('button', { name: /add field/i }).click();

  // Assert navigation
  await expect(page).toHaveURL('/endpoints/1/fields');
});

test('displays error when form submission fails', async ({ page }) => {
  await page.route('**/endpoints/1/fields', route => {
    route.fulfill({
      status: 400,
      json: { message: 'Failed to add field' }
    });
  });

  await page.getByLabel(/field name/i).fill('email');
  await page.getByLabel(/data type/i).selectOption('VARCHAR');
  await page.getByLabel(/is required/i).check();
  await page.getByRole('button', { name: /add field/i }).click();

  // Assert error message
  await expect(page.getByText('Failed to add field')).toBeVisible();
});

test('navigates to add data page', async ({ page }) => {
  await page.getByRole('button', { name: /add data/i }).click();
  await expect(page).toHaveURL('/endpoints/1/add-data');
});

test('navigates back to endpoints page', async ({ page }) => {
  await page.getByRole('link', { name: /back to endpoints/i }).click();
  await expect(page).toHaveURL('/endpoints');
});

test('navigates back to dashboard', async ({ page }) => {
  await page.getByRole('link', { name: /back to dashboard/i }).click();
  await expect(page).toHaveURL('/dashboard');
});

// Note: The test for deleting fields has been removed as the delete functionality is commented out in the component
