const express = require("express");
const router = express.Router();
const { awardXPByFirebaseUid } = require("../services/xpService");

// Central XP update endpoint
// Example: POST /api/xp/update
// Body: { firebaseUid: string, xp: number, reason?: string, taskId?: string }
router.post("/update", async (req, res) => {
  try {
    const { firebaseUid, xp, reason, taskId } = req.body;

    if (!firebaseUid || !xp || xp <= 0) {
      return res.status(400).json({ error: "firebaseUid and a positive xp value are required" });
    }

    // Use centralized XP service without MongoDB transactions so this works
    // on a standalone local MongoDB instance.
    const updatedUser = await awardXPByFirebaseUid(firebaseUid, xp);

    res.json({
      firebaseUid,
      level: updatedUser.level,
      xp: updatedUser.xp,
      totalXP: updatedUser.totalXP,
      todayXP: updatedUser.todayXP,
      totalPoints: updatedUser.totalPoints,
      streak: updatedUser.streak,
      tasksCompleted: updatedUser.tasksCompleted,
      lastXPUpdateDate: updatedUser.lastXPUpdateDate,
      meta: {
        reason: reason || null,
        taskId: taskId || null,
      },
    });
  } catch (error) {
    console.error("Error in /api/xp/update:", error);
    res.status(500).json({ error: "Server error updating XP" });
  }
});

module.exports = router;
