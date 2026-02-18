const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse raw text (Lua script)
app.use(bodyParser.text({ type: "text/plain" }));

// CORS (so your frontend can call it)
const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Prometheus Lua Obfuscator Backend is running");
});

app.post("/obfuscate", (req, res) => {
  const luaCode = req.body;

  if (!luaCode || !luaCode.trim()) {
    return res.status(400).send("No script provided");
  }

  // Save script to a temporary file
  const tmpFile = path.join(__dirname, "temp.lua");
  fs.writeFileSync(tmpFile, luaCode);

  // Run Prometheus CLI on the temp file
  // Adjust --preset as needed: Low, Medium, High
  exec(`lua cli.lua --preset Medium ${tmpFile}`, (err, stdout, stderr) => {
    // Remove the temp file after processing
    fs.unlinkSync(tmpFile);

    if (err) {
      console.error("Obfuscation error:", stderr);
      return res.status(500).send(stderr || "Error during obfuscation");
    }

    res.send(stdout);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Prometheus backend running on port ${PORT}`);
});
