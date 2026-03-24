const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    content: String,
    category: String,
    priority: String,
    editedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const mentorDirectiveSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["DSA", "SYSTEM_DESIGN", "PROJECT", "BUILD_IN_PUBLIC", "GENERAL"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["NOW", "THIS_WEEK", "BACKLOG"],
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "IN_PROGRESS", "DONE", "SKIPPED"],
    },
    version: { type: Number, default: 1 },
    versions: [versionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorDirective", mentorDirectiveSchema);
