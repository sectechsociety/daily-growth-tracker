const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "🏆",
    },
    category: {
      type: String,
      enum: ["streak", "tasks", "points", "level", "special"],
      default: "special",
    },
    requirement: {
      type: Number, // e.g., 7 for 7-day streak
      required: true,
    },
    xpReward: {
      type: Number,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);
