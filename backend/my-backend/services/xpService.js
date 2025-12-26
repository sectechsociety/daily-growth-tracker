const mongoose = require("mongoose");
const User = require("../models/User");

// 15 Level System (1000 XP to 15000 XP)
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

function calculateLevel(totalXP) {
  const xp = typeof totalXP === "number" ? totalXP : Number(totalXP) || 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i].id;
    }
  }
  return 1;
}

function getDateKey(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Centralized XP award logic.
 * Ensures todayXP resets when the calendar day changes and keeps
 * xp, totalXP, totalPoints, level and tasksCompleted in sync.
 *
 * This MUST be the only place that mutates XP on the User model.
 */
async function awardXPToUser(user, xpDelta, options = {}) {
  const { session, incrementTasksCompleted = false, now = new Date() } = options;

  if (!user || !xpDelta || xpDelta <= 0) {
    return user;
  }

  try {
    const currentDateKey = getDateKey(now);

    // Reset todayXP if the last update was on a different day
    if (user.lastXPUpdateDate) {
      const lastDateKey = getDateKey(user.lastXPUpdateDate);
      if (lastDateKey !== currentDateKey) {
        user.todayXP = 0;
      }
    }

    const currentTotalXP =
      typeof user.totalXP === "number" && !Number.isNaN(user.totalXP)
        ? user.totalXP
        : typeof user.xp === "number" && !Number.isNaN(user.xp)
        ? user.xp
        : 0;

    const safeTodayXP =
      typeof user.todayXP === "number" && !Number.isNaN(user.todayXP)
        ? user.todayXP
        : 0;

    const newTotalXP = currentTotalXP + xpDelta;
    const newTodayXP = safeTodayXP + xpDelta;

    user.totalXP = newTotalXP;
    user.xp = newTotalXP; // keep legacy field in sync
    user.todayXP = newTodayXP;
    user.totalPoints = (user.totalPoints || 0) + xpDelta;
    if (incrementTasksCompleted) {
      user.tasksCompleted = (user.tasksCompleted || 0) + 1;
    }
    user.level = calculateLevel(newTotalXP);
    user.lastXPUpdateDate = now;

    if (session) {
      return await user.save({ session });
    }
    return await user.save();
  } catch (error) {
    console.error("Error in awardXPToUser:", error);
    throw error;
  }
}

/**
 * Convenience helper: award XP by firebaseUid.
 */
async function awardXPByFirebaseUid(firebaseUid, xpDelta, options = {}) {
  const { session } = options;

  if (!firebaseUid) {
    throw new Error("firebaseUid is required to award XP");
  }

  const query = { firebaseUid };

  let user = session
    ? await User.findOne(query).session(session)
    : await User.findOne(query);

  // If no user exists yet for this Firebase UID, create a minimal profile
  // so XP can be awarded on first interaction. We intentionally keep this
  // lightweight and let dedicated profile flows enrich the document later.
  if (!user) {
    const baseUserData = {
      firebaseUid,
      name: `Explorer-${String(firebaseUid).slice(0, 6) || "User"}`,
      authMethod: "firebase",
    };

    user = new User(baseUserData);

    if (session) {
      await user.save({ session });
    } else {
      await user.save();
    }
  }

  return awardXPToUser(user, xpDelta, options);
}

module.exports = {
  LEVELS,
  calculateLevel,
  awardXPToUser,
  awardXPByFirebaseUid,
};
