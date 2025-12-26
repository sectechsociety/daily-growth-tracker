const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const { awardXPToUser } = require("../services/xpService");

// Get or create user profile
router.post("/profile", async (req, res) => {
  try {
    const { firebaseUid, email, name, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: "Firebase UID and email are required" });
    }

    // Find existing user or create new one
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = new User({
        firebaseUid,
        email,
        name: name || email.split("@")[0],
        photoURL: photoURL || "",
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user by Firebase UID
router.get("/profile/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
router.put("/profile/:firebaseUid", async (req, res) => {
  try {
    const { name, bio, photoURL } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { name, bio, photoURL },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user stats (XP, level, points)
router.patch("/profile/:firebaseUid/stats", async (req, res) => {
  try {
    const { xp, level, totalPoints, streak } = req.body;

    const updateData = {};
    if (xp !== undefined) updateData.xp = xp;
    if (level !== undefined) updateData.level = level;
    if (totalPoints !== undefined) updateData.totalPoints = totalPoints;
    if (streak !== undefined) updateData.streak = streak;
    updateData.lastActiveDate = new Date();

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating stats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add achievement to user
router.post("/profile/:firebaseUid/achievements", async (req, res) => {
  try {
    const { name, icon } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      {
        $push: {
          achievements: {
            name,
            icon,
            unlockedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error adding achievement:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user progress (JWT authenticated)
router.get("/progress", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      streak: user.streak,
      tasksCompleted: user.tasksCompleted,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add XP to user (JWT authenticated, centralized XP logic)
router.post("/add-xp", verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { xp } = req.body;

    if (!xp || xp <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Valid XP amount required" });
    }

    const user = await User.findById(req.userId).session(session);
    
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await awardXPToUser(user, xp, { session });
    updatedUser.lastActiveDate = new Date();
    await updatedUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      level: updatedUser.level,
      xp: updatedUser.xp,
      totalXP: updatedUser.totalXP,
      todayXP: updatedUser.todayXP,
      totalPoints: updatedUser.totalPoints,
      message: `Added ${xp} XP!`,
    });
  } catch (error) {
    console.error("Error adding XP (centralized):", error);
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error("Error aborting add-xp transaction:", abortError);
    }
    session.endSession();
    res.status(500).json({ error: "Server error" });
  }
});

// Public stats endpoint (can be used by dashboard/profile/leaderboard)
router.get("/stats/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid }).select(
      "name email photoURL level xp totalXP todayXP totalPoints streak tasksCompleted lastXPUpdateDate"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      firebaseUid,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      level: user.level,
      xp: user.xp,
      totalXP: user.totalXP || user.xp || 0,
      todayXP: user.todayXP || 0,
      totalPoints: user.totalPoints || 0,
      streak: user.streak || 0,
      tasksCompleted: user.tasksCompleted || 0,
      lastXPUpdateDate: user.lastXPUpdateDate,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Save avatar customization
router.post("/avatar", verifyToken, async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ error: "Avatar data is required" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.avatar = avatar;
    await user.save();

    res.json({
      message: "Avatar saved successfully",
      avatar: user.avatar
    });
  } catch (error) {
    console.error("Error saving avatar:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get avatar customization
router.get("/avatar", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('avatar');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      avatar: user.avatar || {
        skin: '#FDBCB4',
        hair: { style: 'short', color: '#2C1B18' },
        eyes: '#8B4513',
        clothes: { top: 'tshirt', color: '#4ECDC4' },
        accessories: 'none'
      }
    });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get detailed user stats for profile page
router.get("/profile-stats", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate level progress (frontend expects 250 XP per level)
    const currentLevelXp = (user.level - 1) * 250;
    const nextLevelXp = user.level * 250;
    const progressPercent = Math.min(((user.xp - currentLevelXp) / 250) * 100, 100);

    // Generate badges based on user achievements (this is a simple implementation)
    const badges = [];
    if (user.tasksCompleted >= 1) badges.push('First Steps');
    if (user.streak >= 7) badges.push('Week Warrior');
    if (user.level >= 5) badges.push('Rising Star');
    if (user.xp >= 1000) badges.push('XP Hunter');
    if (user.tasksCompleted >= 50) badges.push('Task Master');

    // Format badges with proper structure for frontend
    const formattedBadges = badges.map((badgeName, index) => ({
      name: badgeName,
      description: `Achievement: ${badgeName}`,
      rarity: index === 0 ? 'common' : index === 1 ? 'rare' : index === 2 ? 'epic' : 'legendary',
      icon: index === 0 ? '🌱' : index === 1 ? '⚡' : index === 2 ? '⭐' : '🏆'
    }));

    res.json({
      progress: {
        level: user.level,
        xp: user.xp,
        totalXp: user.totalPoints || user.xp,
        todayXp: Math.floor(Math.random() * 50) + 10, // Mock daily XP
        weeklyXp: Math.floor(Math.random() * 200) + 100, // Mock weekly XP
        currentLevelXp,
        nextLevelXp,
        progressPercent
      },
      stats: {
        streak: user.streak || 0,
        tasksCompleted: user.tasksCompleted || 0,
        badges: formattedBadges,
        skillsUnlocked: Math.floor(user.level / 2) || 1,
        achievements: formattedBadges.length
      }
    });
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
