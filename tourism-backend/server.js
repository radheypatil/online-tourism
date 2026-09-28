const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Desidwar Online Tourism Platform API is live",
    timestamp: new Date().toISOString(),
  });
});

// 2. API routes
app.use("/api/newsletter", require("./routes/newsletter"));

// 3. Serve static frontend files from tourism-site
const frontendPath = path.join(__dirname, "../tourism-site");
app.use(express.static(frontendPath));

// 4. Fallback for any other route to index.html (Express 5 compatible catch-all)
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Desidwar Server running live on port ${PORT}`);
  console.log(`🌐 Serving frontend from: ${frontendPath}`);
});
