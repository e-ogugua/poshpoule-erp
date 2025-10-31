// Minimal Playwright smoke test placeholder for PoshPOULE ERP
// Visits homepage and asserts title/text presence.
import { test, expect, type Page } from '@playwright/test';

test('loads homepage', async ({ page }: { page: Page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/PoshPOULE|Next\.js|Home/i);
});
