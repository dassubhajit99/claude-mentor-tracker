const express = require("express");
const router = express.Router();
const LearningEntry = require("../models/LearningEntry");

// GET /api/entries — list all, with optional filters
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.track) filter.track = req.query.track;
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(",") };
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }
    const entries = await LearningEntry.find(filter).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/entries/:id — get one
router.get("/:id", async (req, res) => {
  try {
    const entry = await LearningEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/entries — create
router.post("/", async (req, res) => {
  try {
    const entry = new LearningEntry(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/entries/:id — update, pushes old version
router.put("/:id", async (req, res) => {
  try {
    const entry = await LearningEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    // Push current state into versions array
    entry.versions.push({
      title: entry.title,
      content: entry.content,
      track: entry.track,
      tags: [...entry.tags],
      editedAt: new Date(),
    });
    entry.version += 1;

    // Apply updates
    if (req.body.title !== undefined) entry.title = req.body.title;
    if (req.body.content !== undefined) entry.content = req.body.content;
    if (req.body.track !== undefined) entry.track = req.body.track;
    if (req.body.tags !== undefined) entry.tags = req.body.tags;

    const saved = await entry.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/entries/:id — delete
router.delete("/:id", async (req, res) => {
  try {
    const entry = await LearningEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
