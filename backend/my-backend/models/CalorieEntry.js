const mongoose = require("mongoose");

const calorieEntrySchema = new mongoose.Schema({
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
  // Daily calorie goal
  dailyGoal: {
    type: Number,
    required: true,
    min: 500, // Minimum healthy calorie intake
    max: 10000, // Maximum reasonable calorie goal
    default: 2000,
  },
  // Total calories consumed today
  totalCalories: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Remaining calories for the day
  remainingCalories: {
    type: Number,
    default: 0,
  },
  // Meals/foods consumed today
  meals: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack", "beverage"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  // Achievement tracking
  goalAchieved: {
    type: Boolean,
    default: false,
  },
  overGoal: {
    type: Boolean,
    default: false,
  },
  // Water intake tracking (in ml)
  waterIntake: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Exercise calories burned (optional)
  exerciseCalories: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Notes for the day
  notes: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// Create compound index for user and date (unique per day)
calorieEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for date range queries
calorieEntrySchema.index({ userId: 1, date: -1 });

// Virtual for progress percentage
calorieEntrySchema.virtual('progressPercentage').get(function() {
  if (this.dailyGoal === 0) return 0;
  const progress = (this.totalCalories / this.dailyGoal) * 100;
  return Math.min(progress, 100);
});

// Pre-save middleware to calculate remaining calories and achievements
calorieEntrySchema.pre('save', function(next) {
  this.remainingCalories = this.dailyGoal - this.totalCalories;
  this.goalAchieved = this.totalCalories >= this.dailyGoal && this.totalCalories <= this.dailyGoal * 1.1; // Within 10% over goal
  this.overGoal = this.totalCalories > this.dailyGoal * 1.1;

  next();
});

module.exports = mongoose.model("CalorieEntry", calorieEntrySchema);
