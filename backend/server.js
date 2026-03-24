require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Ensure DB is connected on every request (cached across warm invocations)
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState < 1) {
      const MONGO_URI = process.env.MONGO_URI;
      if (!MONGO_URI) return res.status(500).json({ error: "MONGO_URI not set" });
      await mongoose.connect(MONGO_URI);
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/directives", require("./routes/directives"));
app.use("/api/entries", require("./routes/entries"));

// Health check
app.get("/", (req, res) => res.json({ status: "ok" }));

// Local dev only — Vercel handles listening in production
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
