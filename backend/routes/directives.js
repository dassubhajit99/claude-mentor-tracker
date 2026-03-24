const express = require("express");
const router = express.Router();
const MentorDirective = require("../models/MentorDirective");
const requireApiKey = require("../middleware/requireApiKey");

// GET /api/directives — list all, with optional filters
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.status) filter.status = req.query.status;
    const directives = await MentorDirective.find(filter).sort({ createdAt: -1 });
    res.json(directives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/directives/:id — get one
router.get("/:id", async (req, res) => {
  try {
    const directive = await MentorDirective.findById(req.params.id);
    if (!directive) return res.status(404).json({ error: "Directive not found" });
    res.json(directive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/directives — create (requires API key)
router.post("/", requireApiKey, async (req, res) => {
  try {
    const directive = new MentorDirective(req.body);
    const saved = await directive.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/directives/:id — update (requires API key), pushes old version
router.put("/:id", requireApiKey, async (req, res) => {
  try {
    const directive = await MentorDirective.findById(req.params.id);
    if (!directive) return res.status(404).json({ error: "Directive not found" });

    // Push current state into versions array
    directive.versions.push({
      content: directive.content,
      category: directive.category,
      priority: directive.priority,
      editedAt: new Date(),
    });
    directive.version += 1;

    // Apply updates
    if (req.body.content !== undefined) directive.content = req.body.content;
    if (req.body.category !== undefined) directive.category = req.body.category;
    if (req.body.priority !== undefined) directive.priority = req.body.priority;
    if (req.body.status !== undefined) directive.status = req.body.status;

    const saved = await directive.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/directives/:id/status — update status only (public)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });

    const directive = await MentorDirective.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!directive) return res.status(404).json({ error: "Directive not found" });
    res.json(directive);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/directives/:id — delete (requires API key)
router.delete("/:id", requireApiKey, async (req, res) => {
  try {
    const directive = await MentorDirective.findByIdAndDelete(req.params.id);
    if (!directive) return res.status(404).json({ error: "Directive not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
