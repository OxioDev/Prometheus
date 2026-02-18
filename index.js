const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.text({ type: "*/*" }));

app.post("/obfuscate", (req, res) => {
    const luaCode = req.body;
    if (!luaCode) return res.status(400).send("No script provided");

    // Save input temporarily
    fs.writeFileSync("input.lua", luaCode);

    // Run Prometheus CLI
    exec("lua prometheus-main.lua input.lua output.lua", (err, stdout, stderr) => {
        if (err) return res.status(500).send(stderr || err.message);
        try {
            const obfuscated = fs.readFileSync("output.lua", "utf-8");
            res.send(obfuscated);
        } catch (readErr) {
            res.status(500).send(readErr.message);
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
