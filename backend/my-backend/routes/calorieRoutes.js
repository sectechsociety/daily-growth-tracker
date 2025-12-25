const express = require("express");
const router = express.Router();
const CalorieEntry = require("../models/CalorieEntry");
const Food = require("../models/Food");
const User = require("../models/User");

// Middleware to get user from token (assuming you have auth middleware)
const authenticateUser = (req, res, next) => {
  // For now, we'll assume userId is passed in the request
  // In a real app, you'd validate JWT token here
  const userId = req.headers.userid || req.body.userId;
  if (!userId) {
    return res.status(401).json({ error: "User ID required" });
  }
  req.userId = userId;
  next();
};

// Get today's calorie entry or create one if it doesn't exist
router.get("/today", authenticateUser, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let calorieEntry = await CalorieEntry.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!calorieEntry) {
      // Create a new entry for today with user's default goal
      const user = await User.findById(req.userId);
      calorieEntry = new CalorieEntry({
        userId: req.userId,
        date: today,
        dailyGoal: user ? user.defaultDailyCalorieGoal : 2000,
      });
      await calorieEntry.save();
    }

    res.json(calorieEntry);
  } catch (error) {
    console.error("Error fetching today's calories:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get calorie entry for a specific date
router.get("/date/:date", authenticateUser, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    let calorieEntry = await CalorieEntry.findOne({
      userId: req.userId,
      date: {
        $gte: date,
        $lt: nextDay
      }
    });

    if (!calorieEntry) {
      // Return empty entry structure
      return res.json({
        date,
        dailyGoal: 2000,
        totalCalories: 0,
        remainingCalories: 2000,
        meals: [],
        goalAchieved: false,
        overGoal: false,
      });
    }

    res.json(calorieEntry);
  } catch (error) {
    console.error("Error fetching calorie entry:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a meal to today's calorie entry
router.post("/add-meal", authenticateUser, async (req, res) => {
  try {
    const { foodId, name, calories, category } = req.body;

    if (!name || !calories || !category) {
      return res.status(400).json({ error: "Name, calories, and category are required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find or create today's entry
    let calorieEntry = await CalorieEntry.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!calorieEntry) {
      const user = await User.findById(req.userId);
      calorieEntry = new CalorieEntry({
        userId: req.userId,
        date: today,
        dailyGoal: user ? user.defaultDailyCalorieGoal : 2000,
      });
    }

    // Add the meal
    const newMeal = {
      foodId: foodId || null,
      name,
      calories: parseInt(calories),
      category,
      timestamp: new Date(),
    };

    calorieEntry.meals.push(newMeal);
    calorieEntry.totalCalories += parseInt(calories);

    // Save the updated entry
    await calorieEntry.save();

    // Update user's total calories tracked and meals logged
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        totalCaloriesTracked: parseInt(calories),
        totalMealsLogged: 1
      }
    });

    // Add XP for logging a meal (5 XP per meal)
    const user = await User.findById(req.userId);
    if (user) {
      user.xp += 5;
      user.tasksCompleted += 1;

      // Check for level up
      const newLevel = Math.floor(user.xp / 100) + 1;
      if (newLevel > user.level && newLevel <= 15) {
        user.level = newLevel;
      }

      await user.save();
    }

    res.json({
      success: true,
      calorieEntry,
      xpGained: 5,
      newLevel: user ? user.level : null,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update daily calorie goal
router.put("/goal", authenticateUser, async (req, res) => {
  try {
    const { dailyGoal } = req.body;

    if (!dailyGoal || dailyGoal < 500 || dailyGoal > 10000) {
      return res.status(400).json({ error: "Valid daily goal (500-10000) is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find or create today's entry
    let calorieEntry = await CalorieEntry.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!calorieEntry) {
      calorieEntry = new CalorieEntry({
        userId: req.userId,
        date: today,
        dailyGoal: parseInt(dailyGoal),
      });
    } else {
      calorieEntry.dailyGoal = parseInt(dailyGoal);
    }

    await calorieEntry.save();

    // Update user's default goal
    await User.findByIdAndUpdate(req.userId, {
      defaultDailyCalorieGoal: parseInt(dailyGoal)
    });

    res.json(calorieEntry);
  } catch (error) {
    console.error("Error updating calorie goal:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset today's calories
router.post("/reset", authenticateUser, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const calorieEntry = await CalorieEntry.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!calorieEntry) {
      return res.status(404).json({ error: "No calorie entry found for today" });
    }

    // Subtract the calories from user's total tracked
    if (calorieEntry.totalCalories > 0) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: {
          totalCaloriesTracked: -calorieEntry.totalCalories,
          totalMealsLogged: -calorieEntry.meals.length
        }
      });
    }

    // Reset the entry
    calorieEntry.totalCalories = 0;
    calorieEntry.remainingCalories = calorieEntry.dailyGoal;
    calorieEntry.meals = [];
    calorieEntry.goalAchieved = false;
    calorieEntry.overGoal = false;
    calorieEntry.waterIntake = 0;
    calorieEntry.exerciseCalories = 0;
    calorieEntry.notes = "";

    await calorieEntry.save();

    res.json(calorieEntry);
  } catch (error) {
    console.error("Error resetting calories:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update water intake
router.put("/water", authenticateUser, async (req, res) => {
  try {
    const { waterIntake } = req.body;

    if (typeof waterIntake !== 'number' || waterIntake < 0) {
      return res.status(400).json({ error: "Valid water intake amount is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let calorieEntry = await CalorieEntry.findOne({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!calorieEntry) {
      const user = await User.findById(req.userId);
      calorieEntry = new CalorieEntry({
        userId: req.userId,
        date: today,
        dailyGoal: user ? user.defaultDailyCalorieGoal : 2000,
      });
    }

    calorieEntry.waterIntake = waterIntake;
    await calorieEntry.save();

    res.json(calorieEntry);
  } catch (error) {
    console.error("Error updating water intake:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get calorie history for a date range
router.get("/history/:startDate/:endDate", authenticateUser, async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);

    const calorieEntries = await CalorieEntry.find({
      userId: req.userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    res.json(calorieEntries);
  } catch (error) {
    console.error("Error fetching calorie history:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get calorie statistics
router.get("/stats/summary", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get last 7 days of entries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEntries = await CalorieEntry.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    const totalDays = recentEntries.length;
    const goalAchievedDays = recentEntries.filter(entry => entry.goalAchieved).length;
    const averageCalories = totalDays > 0
      ? recentEntries.reduce((sum, entry) => sum + entry.totalCalories, 0) / totalDays
      : 0;

    res.json({
      user: {
        defaultDailyCalorieGoal: user.defaultDailyCalorieGoal,
        totalCaloriesTracked: user.totalCaloriesTracked,
        totalMealsLogged: user.totalMealsLogged,
        caloriesGoalStreak: user.caloriesGoalStreak,
        bestCalorieStreak: user.bestCalorieStreak,
      },
      weekly: {
        totalDays,
        goalAchievedDays,
        successRate: totalDays > 0 ? (goalAchievedDays / totalDays) * 100 : 0,
        averageCalories: Math.round(averageCalories),
      },
      recentEntries: recentEntries.slice(0, 7), // Last 7 days
    });
  } catch (error) {
    console.error("Error fetching calorie stats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
