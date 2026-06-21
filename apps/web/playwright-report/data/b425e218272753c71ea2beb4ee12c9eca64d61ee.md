# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lifecycle.spec.ts >> Maal-Material Lifecycle >> A-to-Z User Journey
- Location: e2e\lifecycle.spec.ts:4:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "http://localhost:3002/" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - img [ref=e7]
        - generic [ref=e12]: Maal-Material
      - generic [ref=e13]:
        - heading "The Industrial Commerce Operating System." [level=2] [ref=e14]
        - paragraph [ref=e15]: Maal-Material integrates heavy materials procurement, multi-tenant contractor ERP, smart B2B billing flows, and complex site logistics inside a unified, secure platform.
        - generic [ref=e18]: Platform Kernel v1.0.0 Active
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "Secure Terminal Sign In" [level=3] [ref=e23]
        - paragraph [ref=e24]: Enter credentials to authorize Maal-Material operations.
      - generic [ref=e25]:
        - generic [ref=e26]:
          - img [ref=e27]
          - generic [ref=e29]:
            - paragraph [ref=e30]: Authorization Denied
            - paragraph [ref=e31]: Failed to fetch
        - generic [ref=e32]:
          - generic [ref=e33]:
            - text: Business Email Address
            - generic [ref=e34]:
              - img [ref=e36]
              - textbox "name@constructos.com" [ref=e39]: admin@constructos.com
          - generic [ref=e40]:
            - text: Security Access Key
            - generic [ref=e41]:
              - img [ref=e43]
              - textbox "••••••••••••" [ref=e46]: Admin123!
          - generic [ref=e47]:
            - generic [ref=e48]: "DEV WORKSPACE HYDRATION:"
            - text: Default seed credentials pre-filled for immediate architectural review.
          - button "Access Control Gate" [ref=e49] [cursor=pointer]:
            - text: Access Control Gate
            - img [ref=e50]
  - alert [ref=e52]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Maal-Material Lifecycle', () => {
  4  |   test('A-to-Z User Journey', async ({ page }) => {
  5  |     test.setTimeout(120000);
  6  | 
  7  |     // 1. Auth Login
  8  |     await page.goto('http://localhost:3002/login');
  9  |     await page.locator('input[type="email"]').clear();
  10 |     await page.fill('input[type="email"]', 'admin@constructos.com');
  11 |     await page.locator('input[type="password"]').clear();
  12 |     await page.fill('input[type="password"]', 'Admin123!');
  13 |     await page.click('button[type="submit"]');
  14 | 
  15 |     // Wait for redirect to dashboard
> 16 |     await page.waitForURL('http://localhost:3002/', { timeout: 60000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
  17 |     await expect(page.locator('h1')).toContainText('Civilization Override', { timeout: 15000 });
  18 | 
  19 |     // 2. Perform a Checkout Flow
  20 |     // Use window.location.href instead of page.goto to prevent WebKit cookie loss on localhost HTTP
  21 |     await page.evaluate(() => {
  22 |       window.location.href = '/checkout';
  23 |     });
  24 |     await page.waitForURL('http://localhost:3002/checkout', { timeout: 30000 });
  25 |     await page.waitForURL('**/checkout', { timeout: 15000 });
  26 |     await expect(page.locator('h1')).toContainText('B2B Checkout', { timeout: 10000 });
  27 | 
  28 |     // Wait for the product catalog to load
  29 |     await page.waitForSelector('text=SKU:', { timeout: 30000 });
  30 | 
  31 |     // Wait for customer dropdown to populate (more than just placeholder)
  32 |     const customerSelect = page.locator('select');
  33 |     await expect(customerSelect.locator('option')).not.toHaveCount(1, { timeout: 15000 });
  34 | 
  35 |     // Select the first real customer
  36 |     await customerSelect.selectOption({ index: 1 });
  37 | 
  38 |     // Add product to cart
  39 |     const addButton = page.locator('button:has(svg.lucide-plus)').first();
  40 |     await addButton.waitFor({ state: 'visible', timeout: 5000 });
  41 |     await addButton.click();
  42 | 
  43 |     // Verify cart is not empty
  44 |     await expect(page.locator('text=Cart is empty')).not.toBeVisible({ timeout: 5000 });
  45 | 
  46 |     // Place Order
  47 |     const placeOrderBtn = page.locator('button:has-text("Place Corporate Order")');
  48 |     await expect(placeOrderBtn).toBeEnabled({ timeout: 5000 });
  49 |     await placeOrderBtn.click();
  50 | 
  51 |     // Wait for success
  52 |     await expect(page.locator('h2')).toContainText('Order Placed Successfully!', { timeout: 30000 });
  53 | 
  54 |     // 3. Verify in orders
  55 |     await page.goto('http://localhost:3002/orders');
  56 |     await expect(page.locator('h1')).toContainText('Order Management', { timeout: 10000 });
  57 |   });
  58 | });
  59 | 
```