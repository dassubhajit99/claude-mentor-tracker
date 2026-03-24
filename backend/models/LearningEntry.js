const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    track: String,
    tags: [String],
    editedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const learningEntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    track: {
      type: String,
      required: true,
      enum: ["DSA", "SYSTEM_DESIGN", "PROJECT", "BUILD_IN_PUBLIC", "GENERAL"],
    },
    tags: [String],
    version: { type: Number, default: 1 },
    versions: [versionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningEntry", learningEntrySchema);
