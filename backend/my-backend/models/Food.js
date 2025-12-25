const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack", "beverage"],
    default: "snack",
  },
  servingSize: {
    type: String,
    default: "",
  },
  brand: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  // Nutritional information (optional)
  nutrition: {
    protein: { type: Number, default: 0 }, // grams
    carbs: { type: Number, default: 0 }, // grams
    fat: { type: Number, default: 0 }, // grams
    fiber: { type: Number, default: 0 }, // grams
  },
  // Common foods database (for quick selection)
  isCustom: {
    type: Boolean,
    default: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Create compound index for user and date for efficient queries
foodSchema.index({ userId: 1, createdAt: -1 });

// Index for favorites
foodSchema.index({ userId: 1, isFavorite: 1 });

module.exports = mongoose.model("Food", foodSchema);
