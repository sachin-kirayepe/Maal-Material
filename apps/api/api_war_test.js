const API_BASE = "http://127.0.0.1:3001/api/v1";

async function runWarTest() {
  console.log("==========================================");
  console.log("PHASE 2: API WAR TESTING INITIATED");
  console.log("Target:", API_BASE);
  console.log("==========================================\n");

  const results = {
    malformedJSON: null,
    massivePayload: null,
    recursiveJSON: null,
    nullInjection: null,
    authBypass: null,
  };

  // 1. Malformed JSON test
  try {
    console.log("[+] Running Test 1: Malformed JSON");
    const res = await fetch(`${API_BASE}/tax/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ invalidJson: true",
    });
    results.malformedJSON = res.status;
    console.log(`    Result: Status ${res.status}`);
  } catch (e) {
    results.malformedJSON = e.message;
  }

  // 2. Massive Payload (10MB)
  try {
    console.log("[+] Running Test 2: Massive Payload (10MB)");
    const massiveString = "A".repeat(10 * 1024 * 1024);
    const res = await fetch(`${API_BASE}/tax/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: massiveString }),
    });
    results.massivePayload = res.status;
    console.log(`    Result: Status ${res.status}`);
  } catch (e) {
    results.massivePayload = e.message;
  }

  // 3. Recursive / Deeply Nested JSON
  try {
    console.log("[+] Running Test 3: Recursive / Deeply Nested JSON");
    let nestedObj = {};
    let current = nestedObj;
    for (let i = 0; i < 5000; i++) {
      current.child = {};
      current = current.child;
    }
    const res = await fetch(`${API_BASE}/tax/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nestedObj),
    });
    results.recursiveJSON = res.status;
    console.log(`    Result: Status ${res.status}`);
  } catch (e) {
    results.recursiveJSON = e.message;
  }

  // 4. Null Injection
  try {
    console.log("[+] Running Test 4: Null Injection");
    const res = await fetch(`${API_BASE}/tax/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "null",
    });
    results.nullInjection = res.status;
    console.log(`    Result: Status ${res.status}`);
  } catch (e) {
    results.nullInjection = e.message;
  }

  // 5. Auth Bypass
  try {
    console.log("[+] Running Test 5: Authorization Bypass (Hitting /users)");
    const res = await fetch(`${API_BASE}/users`, {
      method: "GET",
    });
    results.authBypass = res.status;
    console.log(`    Result: Status ${res.status}`);
  } catch (e) {
    results.authBypass = e.message;
  }

  console.log("\n==========================================");
  console.log("WAR TEST SUMMARY:");
  console.log(
    "Malformed JSON     : ",
    results.malformedJSON === 400 ? "PASS (400)" : `FAIL (${results.malformedJSON})`,
  );
  console.log(
    "Massive Payload    : ",
    results.massivePayload === 413 ? "PASS (413)" : `FAIL (${results.massivePayload})`,
  );
  console.log(
    "Recursive JSON     : ",
    results.recursiveJSON === 400 || results.recursiveJSON === 413
      ? "PASS (Protected)"
      : `FAIL (Status: ${results.recursiveJSON})`,
  );
  console.log(
    "Null Injection     : ",
    results.nullInjection === 400 ? "PASS (400)" : `FAIL (${results.nullInjection})`,
  );
  console.log(
    "Auth Bypass        : ",
    results.authBypass === 401 || results.authBypass === 403
      ? "PASS (Blocked)"
      : `FAIL (Status: ${results.authBypass})`,
  );
  console.log("==========================================");
}

runWarTest().catch(console.error);
