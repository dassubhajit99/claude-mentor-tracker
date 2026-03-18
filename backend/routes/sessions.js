const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// GET /api/sessions — list all, optional ?level=N filter, sorted newest first
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.level) {
      filter.roadmapLevel = Number(req.query.level);
    }
    const sessions = await Session.find(filter).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions — create
router.post("/", async (req, res) => {
  try {
    const session = new Session(req.body);
    const saved = await session.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/sessions/:id — get one
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sessions/:id — update
router.put("/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/sessions/:id — delete
router.delete("/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
