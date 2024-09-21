import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/endpoints/1/fields', route => {
    const mockFields = [
      { field_id: 1, field_name: 'name', data_type: 'STRING', is_required: true },
      { field_id: 2, field_name: 'age', data_type: 'INT', is_required: false },
    ];
    route.fulfill({ json: mockFields });
  });

  await page.goto('/endpoints/1/fields');
});

test('renders FieldList component', async ({ page }) => {
  await expect(page.getByText('Field List')).toBeVisible();
  await expect(page.getByText('name')).toBeVisible();
  await expect(page.getByText('age')).toBeVisible();
});

test('has link to add field page', async ({ page }) => {
  const addFieldLink = page.getByText(/add field/i);
  await expect(addFieldLink).toHaveAttribute('href', '/endpoints/1/fields/add');
});

test('has back arrow link to endpoints', async ({ page }) => {
  const backArrow = page.getByTestId('back-arrow');
  await expect(backArrow).toHaveAttribute('href', '/endpoints');
});