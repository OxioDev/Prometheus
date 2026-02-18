const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.text({ type: "*/*" }));

app.get("/", (req, res) => {
  res.send("Backend is online!");
});

app.post("/obfuscate", (req, res) => {
  const luaCode = req.body;
  if (!luaCode) return res.status(400).send("No script provided");
  // TODO: call Prometheus or obfuscator logic here
  res.send("obfuscation result placeholder");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
