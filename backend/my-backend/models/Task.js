const mongoose = require("mongoose");

// Task XP Values
const TASK_XP_VALUES = {
  "Drink 1L Water": 5,
  "Breakfast": 10,
  "Lunch": 7,
  "Evening Snack": 3,
  "Dinner": 6,
  "Workout": 20,
  "Run/Cardio": 15,
  "Meditation": 12,
  "Reading": 8,
  "Study Session": 15,
  "Sleep 8hrs": 10,
  "Morning Walk": 8,
  "Yoga": 12,
  "Coding Practice": 18,
  "Learn New Skill": 20,
};

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { 
    type: String, 
    enum: ["fitness", "learning", "work", "personal", "health", "nutrition", "wellness", "other"],
    default: "personal" 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"],
    default: "medium" 
  },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending" 
  },
  dueDate: { type: Date },
  completedAt: { type: Date },
  points: { type: Number, default: 10 },
  isRecurring: { type: Boolean, default: false },
  recurringType: { 
    type: String, 
    enum: ["daily", "weekly", "monthly"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
