const http = require('http');

const data = JSON.stringify({
  name: "End to End Test Customer",
  mobile: "9876543210",
  email: "e2e@constructos.com",
  companyName: "E2E Corp",
  customerType: "CONTRACTOR"
});

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/api/v1/customers',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer ' + process.argv[2]
  }
};

const req = http.request(options, (res) => {
  let responseBody = '';
  res.on('data', (chunk) => { responseBody += chunk; });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`RESPONSE: ${responseBody}`);
  });
});

req.on('error', (error) => {
  console.error('ERROR:', error);
});

req.write(data);
req.end();
