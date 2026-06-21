const http = require("http");

const loginData = JSON.stringify({ email: "admin@constructos.com", password: "Admin123!" });

const req = http.request(
  {
    hostname: "localhost",
    port: 3001,
    path: "/api/v1/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": loginData.length,
    },
  },
  (res) => {
    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      const data = JSON.parse(body);
      console.log("LOGIN RESPONSE:", data);

      const token = data.data.accessToken;

      const req2 = http.request(
        {
          hostname: "localhost",
          port: 3001,
          path: "/api/v1/customers",
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        (res2) => {
          let body2 = "";
          res2.on("data", (chunk) => (body2 += chunk));
          res2.on("end", () => {
            console.log("CUSTOMERS STATUS:", res2.statusCode);
            const customers = JSON.parse(body2);

            if (customers.data.length === 0) {
              console.log("--- NO CUSTOMERS FOUND, CREATING ONE ---");
              const createData = JSON.stringify({
                name: "ConstructOS Contractor",
                mobile: "9876543210",
                email: "contractor@constructos.com",
                companyName: "ConstructOS Building",
                customerType: "CONTRACTOR"
              });

              const req3 = http.request({
                hostname: 'localhost',
                port: 3001,
                path: '/api/v1/customers',
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Content-Length': createData.length
                }
              }, (res3) => {
                let data3 = '';
                res3.on('data', chunk => data3 += chunk);
                res3.on('end', () => {
                  console.log(`CREATE CUSTOMER STATUS: ${res3.statusCode}`);
                  console.log(`CREATE CUSTOMER RESPONSE: ${data3}`);
                });
              });
              req3.write(createData);
              req3.end();
            } else {
              console.log("CUSTOMERS RESPONSE:", body2);
            }
          });
        }
      );
      req2.end();
    });
  }
);
req.write(loginData);
req.end();
