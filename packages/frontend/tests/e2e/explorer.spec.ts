import { test, expect } from '@playwright/test';

test.describe('Windows Explorer E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main explorer layout', async ({ page }) => {
    // Check for "File Explorer" in header
    await expect(page.locator('header')).toContainText('File Explorer');
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('section')).toBeVisible();
  });

  test('should load and display folder tree in left panel', async ({ page }) => {
    // Wait for at least one folder to appear in the tree
    const firstFolder = page.locator('aside .select-none').first();
    await expect(firstFolder).toBeVisible();
  });

  test('should show folder content in right panel when a folder is clicked', async ({ page }) => {
    // Click on a folder in the tree
    const folderInTree = page.locator('aside .select-none').first();
    const folderName = await folderInTree.locator('span.truncate').textContent();
    
    await folderInTree.click();

    // Check if right panel title (breadcrumb) matches
    const breadcrumb = page.locator('section .text-gray-600.font-medium');
    await expect(breadcrumb).toContainText(folderName || '');
  });

  test('should perform global search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Root'); // Assuming "Root" exists in seed data
    
    // Wait for debounce and search results
    await page.waitForTimeout(1000);
    
    // In search results, the breadcrumb title changes
    await expect(page.locator('section .text-gray-600.font-medium')).toContainText('Search results');
  });
});
