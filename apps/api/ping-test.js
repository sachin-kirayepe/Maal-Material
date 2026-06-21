const http = require("http");

http
  .get("http://localhost:3001/api/v1/invalid-route-test", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      console.log("Payload:", JSON.parse(data));
    });
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });
