const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    xpGained: {
      type: Number,
      default: 0,
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "bad", "terrible"],
    },
    notes: {
      type: String,
      default: "",
    },
    activities: [
      {
        type: {
          type: String,
        },
        duration: Number, // in minutes
        description: String,
      },
    ],
  },
  { timestamps: true }
);

// Create compound index for user and date
progressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
