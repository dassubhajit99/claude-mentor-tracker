const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    roadmapLevel: { type: Number, min: 1, max: 5, required: true },
    roadmapPhase: {
      type: String,
      enum: [
        "Level 1: Memory & Data Representation",
        "Level 2: Ownership, Borrowing & Systems I/O",
        "Level 3: Concurrency",
        "Level 4: Networking & Protocols",
        "Level 5: Storage Engine & Inference Runtime",
      ],
      required: true,
    },
    // Sub-phase within a level (e.g. Level 1's Phase 0/1/2)
    subPhase: { type: String },
    currentProgressDescription: { type: String },
    keyDecisions: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
