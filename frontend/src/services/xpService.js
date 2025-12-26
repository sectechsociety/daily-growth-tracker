import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { calculateLevel, xpForNextLevel, progressToNextLevel } from '../lib/utils';

// XP Service to handle all XP-related operations
class XPService {
  // Get user's XP data
  static async getUserXP(userId) {
    try {
      // Try to get from Firebase first
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          xp: userData.xp || 0,
          level: userData.level || 1,
          streak: userData.streak || 0,
          lastCompletedDate: userData.lastCompletedDate || '',
          tasksCompleted: userData.tasksCompleted || 0
        };
      }
      
      // If not in Firebase, check localStorage
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (localUser) {
        return {
          xp: localUser.xp || 0,
          level: localUser.level || 1,
          streak: localUser.streak || 0,
          lastCompletedDate: localUser.lastCompletedDate || '',
          tasksCompleted: localUser.tasksCompleted || 0
        };
      }
      
      // Default values
      return {
        xp: 0,
        level: 1,
        streak: 0,
        lastCompletedDate: '',
        tasksCompleted: 0
      };
    } catch (error) {
      console.error('Error getting user XP:', error);
      throw error;
    }
  }

  // Add XP to user's account
  static async addXP(userId, xpToAdd, taskId = null) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Get current data
      let userData = userDoc.exists() ? userDoc.data() : {};
      
      // Initialize user data if it doesn't exist
      const currentXP = userData.xp || 0;
      const currentLevel = calculateLevel(currentXP);
      const currentStreak = userData.streak || 0;
      const lastCompletedDate = userData.lastCompletedDate || '';
      
      // Check daily XP limit
      const dailyXPData = JSON.parse(localStorage.getItem('dailyXP') || '{}');
      const todayXP = dailyXPData[today] || 0;
      
      if (todayXP + xpToAdd > 100) {
        throw new Error(`Daily XP limit reached! You've earned ${todayXP}/100 XP today.`);
      }
      
      // Calculate new values
      const newXP = currentXP + xpToAdd;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > currentLevel;
      
      // Update streak
      let newStreak = currentStreak;
      if (lastCompletedDate !== today) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        newStreak = (lastCompletedDate === yesterdayStr) ? currentStreak + 1 : 1;
      }
      
      // Prepare update data
      const updateData = {
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        lastCompletedDate: today,
        lastUpdated: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Increment tasks completed if this is from a task
      if (taskId) {
        updateData.tasksCompleted = increment(1);
      }
      
      // Update Firebase
      await setDoc(userRef, updateData, { merge: true });
      
      // Update local storage
      const localUser = {
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        ...updateData,
        tasksCompleted: taskId ? ((userData.tasksCompleted || 0) + 1) : (userData.tasksCompleted || 0)
      };
      localStorage.setItem('user', JSON.stringify(localUser));
      
      // Update daily XP tracking
      dailyXPData[today] = todayXP + xpToAdd;
      localStorage.setItem('dailyXP', JSON.stringify(dailyXPData));
      
      return {
        ...updateData,
        tasksCompleted: localUser.tasksCompleted,
        leveledUp,
        previousLevel: currentLevel
      };
      
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }
  
  // Get user's level progress
  static getLevelProgress(xp) {
    const level = calculateLevel(xp);
    const progress = progressToNextLevel(xp);
    
    return {
      level,
      xp,
      xpNeeded: xpForNextLevel(level),
      progress: progress.progress,
      nextLevel: level + 1
    };
  }
  
  // Sync local XP with server
  static async syncLocalXP(userId) {
    try {
      // Get server data
      const serverData = await XPService.getUserXP(userId);
      
      // Get local data
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // If server has more recent data, update local
      if (serverData.xp > (localUser.xp || 0)) {
        localStorage.setItem('user', JSON.stringify({
          ...localUser,
          ...serverData
        }));
        return serverData;
      }
      
      // If local has more recent data, update server
      if ((localUser.xp || 0) > serverData.xp) {
        await XPService.addXP(userId, 0); // This will sync the data
      }
      
      return localUser.xp ? localUser : serverData;
    } catch (error) {
      console.error('Error syncing XP:', error);
      throw error;
    }
  }
}

export default XPService;
