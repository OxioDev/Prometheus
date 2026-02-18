const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.text({ type: "*/*" }));

// Endpoint
app.post("/obfuscate", (req, res) => {
  const script = req.body;

  if (!script || !script.trim()) {
    return res.status(400).send("No script provided");
  }

  // Save the script temporarily
  const fs = require("fs");
  const tmpFile = path.join(__dirname, "tmp.lua");
  fs.writeFileSync(tmpFile, script);

  // Run Prometheus CLI
  const prometheusPath = path.join(__dirname, "cli.lua"); // path to your cli.lua
  const cmd = `lua "${prometheusPath}" --preset Medium "${tmpFile}"`;

  exec(cmd, (error, stdout, stderr) => {
    // Clean up tmp file
    fs.unlinkSync(tmpFile);

    if (error) {
      console.error("Prometheus error:", stderr);
      return res.status(500).send("Obfuscation failed: " + stderr);
    }

    // Return obfuscated script
    res.send(stdout);
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("Prometheus backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
