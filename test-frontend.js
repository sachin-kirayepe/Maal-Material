const http = require("http");
http
  .get("http://localhost:3000/smb-dashboard", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("Status code:", res.statusCode);
      if (
        data.includes("Naya Bill Banaye") ||
        data.includes("Dukaan") ||
        data.includes("Quick Bill")
      ) {
        console.log("SMB Dashboard page successfully compiled and rendered!");
      } else {
        console.log("Page loaded but expected text not found.");
        console.log(data.substring(0, 500));
      }
    });
  })
  .on("error", (err) => {
    console.error("Error fetching page:", err.message);
  });
