const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get global leaderboard (top users by total points)
router.get("/global", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find()
      .select("name email photoURL level xp totalPoints streak")
      .sort({ totalPoints: -1 })
      .limit(parseInt(limit));

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get leaderboard by XP
router.get("/xp", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find()
      .select("name email photoURL level xp totalPoints streak")
      .sort({ xp: -1 })
      .limit(parseInt(limit));

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error("Error fetching XP leaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get leaderboard by streak
router.get("/streak", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find()
      .select("name email photoURL level xp totalPoints streak")
      .sort({ streak: -1 })
      .limit(parseInt(limit));

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error("Error fetching streak leaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's rank
router.get("/rank/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count users with higher total points
    const rank = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints },
    });

    res.json({
      rank: rank + 1,
      totalPoints: user.totalPoints,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
