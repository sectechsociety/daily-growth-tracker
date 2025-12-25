const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");

// Get all tasks for a user
router.get("/:userId", async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = { userId: req.params.userId };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single task
router.get("/:userId/:taskId", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.params.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      category,
      priority,
      dueDate,
      points,
      isRecurring,
      recurringType,
    } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: "User ID and title are required" });
    }

    const task = new Task({
      userId,
      title,
      description,
      category,
      priority,
      dueDate,
      points: points || 10,
      isRecurring,
      recurringType,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update task
router.put("/:taskId", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Level calculation helper (1000 XP to 15000 XP)
const LEVELS = [
  { id: 1, xpRequired: 1000 },
  { id: 2, xpRequired: 2000 },
  { id: 3, xpRequired: 3000 },
  { id: 4, xpRequired: 4000 },
  { id: 5, xpRequired: 5000 },
  { id: 6, xpRequired: 6000 },
  { id: 7, xpRequired: 7000 },
  { id: 8, xpRequired: 8000 },
  { id: 9, xpRequired: 9000 },
  { id: 10, xpRequired: 10000 },
  { id: 11, xpRequired: 11000 },
  { id: 12, xpRequired: 12000 },
  { id: 13, xpRequired: 13000 },
  { id: 14, xpRequired: 14000 },
  { id: 15, xpRequired: 15000 },
];

function calculateLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i].id;
    }
  }
  return 1;
}

// Complete a task (awards XP and points)
router.patch("/:taskId/complete", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Mark as completed
    task.status = "completed";
    task.completedAt = new Date();
    await task.save();

    // Award XP and points to user
    const user = await User.findOne({ firebaseUid: task.userId });
    if (user) {
      user.xp += task.points;
      user.totalPoints += task.points;
      
      // Calculate level based on XP (15-level system)
      user.level = calculateLevel(user.xp);
      
      await user.save();
    }

    res.json({ task, user });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete task
router.delete("/:taskId", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get task statistics
router.get("/:userId/stats", async (req, res) => {
  try {
    const userId = req.params.userId;

    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: "completed" });
    const pendingTasks = await Task.countDocuments({ userId, status: "pending" });
    const inProgressTasks = await Task.countDocuments({ userId, status: "in-progress" });

    const tasksByCategory = await Task.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      tasksByCategory,
    });
  } catch (error) {
    console.error("Error fetching task stats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
