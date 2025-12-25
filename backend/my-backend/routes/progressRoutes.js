const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// Get progress for a specific date
router.get("/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;
    const progress = await Progress.findOne({
      userId,
      date: new Date(date),
    });

    if (!progress) {
      return res.status(404).json({ error: "No progress found for this date" });
    }

    res.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get progress history (last N days)
router.get("/:userId/history/:days", async (req, res) => {
  try {
    const { userId, days } = req.params;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const progressHistory = await Progress.find({
      userId,
      date: { $gte: daysAgo },
    }).sort({ date: -1 });

    res.json(progressHistory);
  } catch (error) {
    console.error("Error fetching progress history:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create or update daily progress
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      date,
      tasksCompleted,
      pointsEarned,
      xpGained,
      mood,
      notes,
      activities,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const progressDate = date ? new Date(date) : new Date();
    progressDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Update or create progress entry
    const progress = await Progress.findOneAndUpdate(
      { userId, date: progressDate },
      {
        tasksCompleted,
        pointsEarned,
        xpGained,
        mood,
        notes,
        activities,
      },
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (error) {
    console.error("Error saving progress:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get weekly summary
router.get("/:userId/summary/week", async (req, res) => {
  try {
    const { userId } = req.params;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyProgress = await Progress.find({
      userId,
      date: { $gte: weekAgo },
    }).sort({ date: 1 });

    const summary = {
      totalTasksCompleted: 0,
      totalPointsEarned: 0,
      totalXpGained: 0,
      daysActive: weeklyProgress.length,
      dailyBreakdown: weeklyProgress,
    };

    weeklyProgress.forEach((day) => {
      summary.totalTasksCompleted += day.tasksCompleted || 0;
      summary.totalPointsEarned += day.pointsEarned || 0;
      summary.totalXpGained += day.xpGained || 0;
    });

    res.json(summary);
  } catch (error) {
    console.error("Error fetching weekly summary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get monthly summary
router.get("/:userId/summary/month", async (req, res) => {
  try {
    const { userId } = req.params;
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const monthlyProgress = await Progress.find({
      userId,
      date: { $gte: monthAgo },
    }).sort({ date: 1 });

    const summary = {
      totalTasksCompleted: 0,
      totalPointsEarned: 0,
      totalXpGained: 0,
      daysActive: monthlyProgress.length,
      averageTasksPerDay: 0,
      dailyBreakdown: monthlyProgress,
    };

    monthlyProgress.forEach((day) => {
      summary.totalTasksCompleted += day.tasksCompleted || 0;
      summary.totalPointsEarned += day.pointsEarned || 0;
      summary.totalXpGained += day.xpGained || 0;
    });

    if (monthlyProgress.length > 0) {
      summary.averageTasksPerDay = (
        summary.totalTasksCompleted / monthlyProgress.length
      ).toFixed(1);
    }

    res.json(summary);
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
