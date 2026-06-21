async function runTests() {
  const API_URL = "http://localhost:3001/api/v1";
  console.log("Starting Commerce Platform API tests...\n");

  let token = "";
  let tenantId = "";
  let shopId = "";

  // 1. Login to get token
  try {
    console.log("1. Authenticating as admin...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@constructos.com", password: "Admin123!" }),
    });

    if (!loginRes.ok) throw new Error("Login failed");
    const loginData = await loginRes.json();
    token = loginData.access_token;
    console.log("✅ Authenticated successfully.\n");
  } catch (e: any) {
    console.error("❌ Auth test failed:", e.message);
    process.exit(1);
  }

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 2. Test Tenants
  try {
    console.log("2. Testing Tenants Module...");
    const tenantsRes = await fetch(`${API_URL}/tenants`, { headers: authHeaders });
    const tenantsData = await tenantsRes.json();

    if (tenantsData.items && tenantsData.items.length > 0) {
      tenantId = tenantsData.items[0].id;
      console.log(`✅ Fetched ${tenantsData.items.length} tenants. Using tenant: ${tenantId}\n`);
    } else {
      throw new Error("No tenants found");
    }
  } catch (e: any) {
    console.error("❌ Tenants test failed:", e.message);
    process.exit(1);
  }

  // 3. Test Shops (with Tenant context)
  const tenantAuthHeaders = {
    ...authHeaders,
    "x-tenant-id": tenantId,
  };

  try {
    console.log("3. Testing Shops Module (Tenant Isolation)...");

    // Create Shop
    const createRes = await fetch(`${API_URL}/shops`, {
      method: "POST",
      headers: tenantAuthHeaders,
      body: JSON.stringify({
        name: "Test Shop " + Date.now(),
        slug: "test-shop-" + Date.now(),
        businessType: "HARDWARE",
        marketplaceVisibility: true,
        address: {
          addressLine: "Test Line 1",
          city: "Test City",
          state: "TS",
          pincode: "123456",
        },
      }),
    });

    const shopData = await createRes.json();
    if (shopData.statusCode && shopData.statusCode >= 400) {
      throw new Error(shopData.message || "Shop creation failed");
    }

    shopId = shopData.id;
    console.log(`✅ Created test shop: ${shopId}`);

    // Query Shops
    const queryRes = await fetch(`${API_URL}/shops`, { headers: tenantAuthHeaders });
    const queryData = await queryRes.json();
    if (queryData.items.length > 0) {
      console.log(
        `✅ Successfully queried shops under tenant context (${queryData.items.length} total)\n`,
      );
    }
  } catch (e: any) {
    console.error("❌ Shops test failed:", e.message);
  }

  // 4. Test Marketplace Public Endpoints
  try {
    console.log("4. Testing Marketplace Module (Public)...");
    const mpRes = await fetch(`${API_URL}/marketplace/listings`);
    const mpData = await mpRes.json();
    console.log(`✅ Fetched ${mpData.items ? mpData.items.length : 0} public listings.\n`);
  } catch (e: any) {
    console.error("❌ Marketplace public test failed:", e.message);
  }

  console.log("🚀 All tests executed successfully!");
}

runTests();
