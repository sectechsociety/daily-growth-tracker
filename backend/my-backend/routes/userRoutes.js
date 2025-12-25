const express = require("express");
const router = express.Router();
const User = require("../models/User");

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

// Add XP to user (JWT authenticated)
router.post("/add-xp", verifyToken, async (req, res) => {
  try {
    const { xp } = req.body;

    if (!xp || xp <= 0) {
      return res.status(400).json({ error: "Valid XP amount required" });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add XP
    user.xp += xp;
    user.totalPoints += xp;

    // Calculate new level based on XP
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

    // Determine level based on total XP
    let newLevel = 1;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (user.xp >= LEVELS[i].xpRequired) {
        newLevel = LEVELS[i].id;
        break;
      }
    }

    user.level = newLevel;
    user.lastActiveDate = new Date();

    await user.save();

    res.json({
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      message: `Added ${xp} XP!`,
    });
  } catch (error) {
    console.error("Error adding XP:", error);
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
