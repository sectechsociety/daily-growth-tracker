import { useState, useEffect, useCallback } from 'react';
import XPService from '../services/xpService';

export const useXP = (user, setUser) => {
  const [xpData, setXPData] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    tasksCompleted: 0,
    skillsUnlocked: 0,
    mindfulMinutes: 0,
    isLoading: true,
    error: null
  });

  // Load user XP data
  const loadXPData = useCallback(async () => {
    try {
      setXPData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const firebaseUid = user?.uid || 
                         JSON.parse(localStorage.getItem('user') || '{}')?.uid || 
                         user?.id || 
                         null;
      
      if (!firebaseUid) {
        throw new Error('User not authenticated');
      }

      // Sync with server and get latest data
      const userData = await XPService.getUserXP(firebaseUid);
      
      // Update local state
      const newXPData = {
        xp: userData.xp || 0,
        level: userData.level || 1,
        streak: userData.streak || 0,
        tasksCompleted: userData.tasksCompleted || 0,
        skillsUnlocked: userData.skillsUnlocked || 0,
        mindfulMinutes: userData.mindfulMinutes || 0,
        isLoading: false,
        error: null
      };
      
      setXPData(newXPData);
      
      // Update parent component if needed
      if (setUser) {
        setUser(prev => ({
          ...prev,
          ...newXPData
        }));
      }
      
      return newXPData;
    } catch (error) {
      console.error('Error loading XP data:', error);
      const errorState = {
        ...xpData,
        isLoading: false,
        error: error.message || 'Failed to load XP data'
      };
      setXPData(errorState);
      throw error;
    }
  }, [user, setUser]);

  // Add XP
  const addXP = useCallback(async (xpToAdd, taskId = null) => {
    try {
      const firebaseUid = user?.uid || 
                         JSON.parse(localStorage.getItem('user') || '{}')?.uid || 
                         user?.id || 
                         null;
      
      if (!firebaseUid) {
        throw new Error('User not authenticated');
      }

      // Add XP using the XP service
      const result = await XPService.addXP(firebaseUid, xpToAdd, taskId);
      
      // Update local state
      const updatedData = {
        ...xpData,
        xp: result.xp,
        level: result.level,
        streak: result.streak,
        tasksCompleted: result.tasksCompleted || xpData.tasksCompleted,
        error: null
      };
      
      setXPData(updatedData);
      
      // Update parent component if needed
      if (setUser) {
        setUser(prev => ({
          ...prev,
          ...updatedData
        }));
      }
      
      return {
        ...result,
        leveledUp: result.level > xpData.level
      };
    } catch (error) {
      console.error('Error adding XP:', error);
      const errorState = {
        ...xpData,
        error: error.message || 'Failed to add XP'
      };
      setXPData(errorState);
      throw error;
    }
  }, [user, xpData, setUser]);

  // Load XP data on mount and when user changes
  useEffect(() => {
    loadXPData();
    
    // Set up periodic sync (every 5 minutes)
    const syncInterval = setInterval(loadXPData, 5 * 60 * 1000);
    
    return () => clearInterval(syncInterval);
  }, [loadXPData]);

  return {
    ...xpData,
    addXP,
    reloadXP: loadXPData
  };
};
