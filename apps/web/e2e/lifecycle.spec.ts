import { test, expect } from '@playwright/test';

test.describe('Maal-Material Lifecycle', () => {
  test('A-to-Z User Journey', async ({ page }) => {
    test.setTimeout(120000);

    // 1. Auth Login
    await page.goto('http://localhost:3002/login');
    await page.locator('input[type="email"]').clear();
    await page.fill('input[type="email"]', 'admin@constructos.com');
    await page.locator('input[type="password"]').clear();
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('http://localhost:3002/', { timeout: 60000 });
    await expect(page.locator('h1')).toContainText('Civilization Override', { timeout: 15000 });

    // 2. Perform a Checkout Flow
    // Use window.location.href instead of page.goto to prevent WebKit cookie loss on localhost HTTP
    await page.evaluate(() => {
      window.location.href = '/checkout';
    });
    await page.waitForURL('http://localhost:3002/checkout', { timeout: 30000 });
    await page.waitForURL('**/checkout', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('B2B Checkout', { timeout: 10000 });

    // Wait for the product catalog to load
    await page.waitForSelector('text=SKU:', { timeout: 30000 });

    // Wait for customer dropdown to populate (more than just placeholder)
    const customerSelect = page.locator('select');
    await expect(customerSelect.locator('option')).not.toHaveCount(1, { timeout: 15000 });

    // Select the first real customer
    await customerSelect.selectOption({ index: 1 });

    // Add product to cart
    const addButton = page.locator('button:has(svg.lucide-plus)').first();
    await addButton.waitFor({ state: 'visible', timeout: 5000 });
    await addButton.click();

    // Verify cart is not empty
    await expect(page.locator('text=Cart is empty')).not.toBeVisible({ timeout: 5000 });

    // Place Order
    const placeOrderBtn = page.locator('button:has-text("Place Corporate Order")');
    await expect(placeOrderBtn).toBeEnabled({ timeout: 5000 });
    await placeOrderBtn.click();

    // Wait for success
    await expect(page.locator('h2')).toContainText('Order Placed Successfully!', { timeout: 30000 });

    // 3. Verify in orders
    await page.goto('http://localhost:3002/orders');
    await expect(page.locator('h1')).toContainText('Order Management', { timeout: 10000 });
  });
});
