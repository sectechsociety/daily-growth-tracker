
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import axios from "axios";
import { useTheme } from "./ThemeContext";
import Game from "./Game";
import LevelRoadmap from "./LevelRoadmap";
import Leaderboard from "./Leaderboard";
import CalorieTracker from "./CalorieTracker";
import UserProfile from "./UserProfile";
import AIAssistant from "./AIAssistant";


const API_URL = 'http://localhost:5000/api';
const xpTasks = [
  { id: 'drink_water', name: 'Drink Water', xp: 5, icon: '💧', color: '#06b6d4' },
  { id: 'breakfast', name: 'Breakfast', xp: 10, icon: '🥐', color: '#f59e0b' },
  { id: 'lunch', name: 'Lunch', xp: 15, icon: '🍱', color: '#10b981' },
  { id: 'dinner', name: 'Dinner', xp: 15, icon: '🍽️', color: '#ef4444' },
  { id: 'take_break', name: 'Take Break', xp: 8, icon: '☕', color: '#8b5cf6' },
  { id: 'run', name: 'Run', xp: 20, icon: '🏃‍♂️', color: '#f97316' },
  { id: 'coding', name: 'Coding', xp: 25, icon: '💻', color: '#3b82f6' },
  { id: 'reading', name: 'Reading', xp: 12, icon: '📚', color: '#6366f1' },
  { id: 'meditation', name: 'Meditation', xp: 18, icon: '🧘‍♀️', color: '#14b8a6' },
  { id: 'exercise', name: 'Exercise', xp: 22, icon: '💪', color: '#ec4899' },
  { id: 'early_bedtime', name: 'Early Bedtime', xp: 12, icon: '😴', color: '#8b5cf6' },
  { id: 'stretching', name: 'Stretching', xp: 10, icon: '🤸‍♀️', color: '#10b981' },
  { id: 'journaling', name: 'Journaling', xp: 15, icon: '📝', color: '#f59e0b' },
  { id: 'walking', name: 'Walking', xp: 18, icon: '🚶‍♀️', color: '#06b6d4' },
  { id: 'gratitude', name: 'Gratitude Practice', xp: 8, icon: '🙏', color: '#fbbf24' },
  { id: 'learning', name: 'Learn Something New', xp: 20, icon: '📚', color: '#6366f1' },
  { id: 'music', name: 'Listen to Music', xp: 8, icon: '🎵', color: '#ec4899' },
  { id: 'cleaning', name: 'Quick Tidy Up', xp: 10, icon: '🧹', color: '#64748b' },
];

// --- MODAL COMPONENTS (Unchanged) ---

const TaskModal = ({ isOpen, onClose, title, task, onSave, onTaskChange, isEdit = false }) => {
  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    onTaskChange({ ...task, [field]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(5px)",
            zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              background: "rgba(25, 35, 55, 0.8)", backdropFilter: "blur(20px) saturate(180%)",
              borderRadius: "25px", padding: "30px", border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)", width: "100%", maxWidth: "500px", color: "#fff"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
              <span style={{ fontSize: "1.5rem" }}>{isEdit ? '✏️' : '➕'}</span>
              <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>{title}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>Task Name</label>
                <input type="text" value={task.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter task name..." style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.05)", color: "#fff", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>XP Points</label>
                <input type="number" value={task.xp || ''} onChange={(e) => handleInputChange('xp', parseInt(e.target.value) || 0)} placeholder="Enter XP points..." min="1" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.05)", color: "#fff", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>Icon</label>
                <select value={task.icon || '⭐'} onChange={(e) => handleInputChange('icon', e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.05)", color: "#fff", fontSize: "0.9rem", outline: "none" }}>
                  {['⭐', '🎯', '🚀', '💪', '🧠', '💡', '🔥', '⚡', '🌟', '🎨', '📚', '🏃‍♂️', '💻', '🎵', '🧘‍♀️'].map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>Color Theme</label>
                <select value={task.color || '#60a5fa'} onChange={(e) => handleInputChange('color', e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.05)", color: "#fff", fontSize: "0.9rem", outline: "none" }}>
                  <option value="#60a5fa">🔵 Blue</option><option value="#f59e0b">🟡 Yellow</option><option value="#10b981">🟢 Green</option><option value="#ef4444">🔴 Red</option><option value="#8b5cf6">🟣 Purple</option><option value="#f97316">🟠 Orange</option><option value="#ec4899">🩷 Pink</option><option value="#06b6d4">🩵 Cyan</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "30px", justifyContent: "flex-end" }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} style={{ padding: "12px 24px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "transparent", color: "#cbd5e1", fontWeight: "600", cursor: "pointer" }}>Cancel</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onSave} style={{ padding: "12px 24px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: "600", cursor: "pointer" }}>{isEdit ? 'Update Task' : 'Add Task'}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, icon }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(5px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ background: "rgba(25, 35, 55, 0.8)", backdropFilter: "blur(20px) saturate(180%)", borderRadius: "25px", padding: "30px", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)", width: "100%", maxWidth: "450px", textAlign: "center", color: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }} style={{ fontSize: "3rem", marginBottom: "20px" }}>{icon}</motion.div>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.3rem", fontWeight: "700" }}>{title}</h3>
            <p style={{ margin: "0 0 25px 0", fontSize: "0.9rem", color: "#cbd5e1", lineHeight: "1.5" }}>{message}</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} style={{ padding: "12px 24px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "transparent", color: "#cbd5e1", fontWeight: "600", cursor: "pointer", flex: 1 }}>Cancel</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onConfirm} style={{ padding: "12px 24px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)", flex: 1 }}>{confirmText}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


function Dashboard({ user, setUser, token, setToken }) {
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, streak: 0, tasksCompleted: 0, skillsUnlocked: 0, mindfulMinutes: 0 });
  const [activeSection, setActiveSection] = useState(0);
  const [roadmapAnimation, setRoadmapAnimation] = useState(false);
  const [xpAnimations, setXpAnimations] = useState([]);
  const [tasks, setTasks] = useState(xpTasks);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProgressResetModal, setShowProgressResetModal] = useState(false);

  // --- Daily Progress States ---
  // `dailyProgress` now tracks UNIQUE tasks completed today
  const [dailyProgress, setDailyProgress] = useState(0); 
  // `taskXP` tracks completion count for EACH task today { taskId: count }
  const [taskXP, setTaskXP] = useState({}); 

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ name: '', xp: 10, icon: '⭐', color: '#60a5fa' });
  const [toast, setToast] = useState(null);

  // --- API & Core Logic (Unchanged) ---
  const makeAuthenticatedRequest = async (url, data = null, method = 'GET') => {
    const config = { method, url: `${API_URL}${url}`, headers: { Authorization: `Bearer ${token}` } };
    if (data) config.data = data;
    return axios(config);
  };

  // --- Daily Progress Functions (UPDATED) ---

  const getTodayKey = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // ** UPDATED load function **
  const loadDailyProgress = () => {
    try {
      // Load the detailed task status object
      const progressData = JSON.parse(localStorage.getItem('dailyTaskStatus') || '{}');
      const todayKey = getTodayKey();

      let todaysTaskXP = {};

      // Check if we need to reset for a new day
      if (progressData.lastUpdated !== todayKey) {
        // If it's a new day, today's task completions start empty
        todaysTaskXP = {};
        // Update storage for the new day
        localStorage.setItem('dailyTaskStatus', JSON.stringify({ todayTaskXP: {}, lastUpdated: todayKey }));
      } else {
        // Otherwise, load today's completions from storage
        todaysTaskXP = progressData.todayTaskXP || {};
      }

      // Set the detailed task completion state
      setTaskXP(todaysTaskXP);
      // Set the unique count state based on the loaded data
      setDailyProgress(Object.keys(todaysTaskXP).length);

    } catch (error) {
      console.error('Error loading daily progress:', error);
      setTaskXP({});
      setDailyProgress(0);
    }
  };

  // ** UPDATED save function (renamed) **
  const saveDailyTaskStatus = (currentTaskXP) => {
    try {
      const progressData = {
        todayTaskXP: currentTaskXP,
        lastUpdated: getTodayKey()
      };
      localStorage.setItem('dailyTaskStatus', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving daily task status:', error);
    }
  };

  // ** REMOVED `updateDailyProgress` - logic moved to addXP **

  // ** UPDATED reset function **
  const resetDailyProgress = () => {
    setTaskXP({}); // Reset task completion counts
    setDailyProgress(0); // Reset unique count
    saveDailyTaskStatus({}); // Save the empty state
    setShowProgressResetModal(false);
    setToast({ message: 'Daily progress reset! Start fresh today! 🌟', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setProfile({ name: "Growth Seeker", email: "demo@example.com", photoURL: null });
    loadDailyProgress(); // Load daily progress on component mount
    if (user?._id && token) {
      makeAuthenticatedRequest('/users/profile-stats')
        .then(response => {
          const { progress, stats } = response.data;
          setUserStats({
            level: progress.level || 1, xp: progress.xp || 0,
            streak: stats.streak || 0, tasksCompleted: stats.tasksCompleted || 0,
            skillsUnlocked: stats.skillsUnlocked || 0, mindfulMinutes: 0
          });
        })
        .catch(error => {
          console.error('Error fetching user stats:', error);
          // Fallback to localStorage user data if API fails
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          setUserStats({
            level: storedUser.level || 1, xp: storedUser.xp || 0, streak: storedUser.streak || 0,
            tasksCompleted: storedUser.tasksCompleted || 0, skillsUnlocked: 0, mindfulMinutes: 0
          });
        });
    } else {
        // Load from localStorage if offline/no token
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUserStats({
            level: storedUser.level || 1, xp: storedUser.xp || 0, streak: storedUser.streak || 0,
            tasksCompleted: storedUser.tasksCompleted || 0, skillsUnlocked: 0, mindfulMinutes: 0
          });
    }
  }, [user, token]); 

  // ** UPDATED addXP function **
  const addXP = async (taskId, xpToAdd) => {
    try {
      const isOffline = !token || token.startsWith('offline_');
      let newLevel, newXp;
      const currentLevel = userStats.level; // Get level *before* adding XP

      if (isOffline) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const currentXp = storedUser.xp || 0;
        newXp = currentXp + xpToAdd;
        // Correct level calculation (assuming 100 XP per level)
        newLevel = Math.floor(newXp / 100) + 1; 

        storedUser.xp = newXp;
        storedUser.level = newLevel;
        storedUser.tasksCompleted = (storedUser.tasksCompleted || 0) + 1;
        localStorage.setItem('user', JSON.stringify(storedUser));
        // Update the user prop if setUser is available
        if (setUser) setUser(storedUser); 
      } else {
        const response = await makeAuthenticatedRequest('/users/add-xp', { xp: xpToAdd }, 'POST');
        newLevel = response.data.level;
        newXp = response.data.xp;
        // Update the user prop if setUser is available
        if (setUser) setUser(prev => ({...prev, xp: newXp, level: newLevel, tasksCompleted: (prev.tasksCompleted || 0) + 1}));
      }

      // Update userStats state (used by LevelRoadmap)
      setUserStats(prev => ({ 
          ...prev, 
          xp: newXp, 
          level: newLevel, 
          tasksCompleted: prev.tasksCompleted + 1 
      }));
      
      // Check for level up *after* states are updated
      if (newLevel > currentLevel) {
          setToast({ message: `Level Up! Reached Level ${newLevel}! ✨`, type: 'success' });
      } else {
          setToast({ message: `+${xpToAdd} XP Gained!`, type: 'success' });
      }
      setTimeout(() => setToast(null), 3000);


      // Trigger roadmap animation for visual feedback (optional)
      setRoadmapAnimation(true);
      setTimeout(() => setRoadmapAnimation(false), 2000);

      // XP floating animation
      const newAnimation = { id: Date.now(), xp: xpToAdd, x: window.innerWidth / 2, y: window.innerHeight / 2 };
      setXpAnimations(prev => [...prev, newAnimation]);
      setTimeout(() => setXpAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id)), 2500);

      // Update daily task completions (taskXP) and unique count (dailyProgress)
      setTaskXP(prev => {
        const newTaskXP = { ...prev, [taskId]: (prev[taskId] || 0) + 1 };
        
        // Calculate unique tasks completed
        const uniqueCount = Object.keys(newTaskXP).length;
        setDailyProgress(uniqueCount); // Update state for unique count
        
        // Save the updated detailed status
        saveDailyTaskStatus(newTaskXP); 
        
        return newTaskXP; // Return the new state for taskXP
      });

      // **IMPORTANT: Update leaderboard in Supabase**
      if (user && user.id) {
        try {
          const { error } = await supabase
            .from('leaderboard')
            .upsert({
              user_id: user.id,
              email: user.email,
              username: user.name || user.email?.split('@')[0] || 'User',
              xp: newXp,
              level: newLevel,
              last_updated: new Date().toISOString()
            });

          if (error) {
            console.error('Error updating leaderboard:', error);
          }
        } catch (error) {
          console.error('Error updating leaderboard:', error);
        }
      }

    } catch (error) {
      console.error('Error adding XP:', error);
      setToast({ message: 'Failed to add XP. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const openAddModal = () => {
    setNewTask({ name: '', xp: 10, icon: '⭐', color: '#60a5fa' });
    setShowAddModal(true);
  };

  const addNewTask = () => {
    if (!newTask.name.trim() || newTask.xp <= 0) {
      setToast({ message: 'Please enter a valid task name and XP value', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const task = { ...newTask, id: `custom_${Date.now()}` };
    setTasks(prev => [task, ...prev]); // Add to the beginning
    setShowAddModal(false);
    setToast({ message: `New task "${task.name}" added!`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const openEditModal = (task) => {
    setEditingTask({ ...task });
    setShowEditModal(true);
  };

  const editTask = () => {
    if (!editingTask || !editingTask.name.trim() || editingTask.xp <= 0) {
      setToast({ message: 'Invalid task details', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setTasks(prev => prev.map(task => task.id === editingTask.id ? editingTask : task));
    setShowEditModal(false);
    setToast({ message: 'Task updated successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  // ** UPDATED resetAllTasks **
  const resetAllTasks = () => {
    // Reset daily progress as well
    setTaskXP({});
    setDailyProgress(0); 
    saveDailyTaskStatus({}); 

    // Reset overall stats (optional, depending on desired behavior)
    // setUserStats(prev => ({ ...prev, tasksCompleted: 0, streak: 0 })); 
    // if (user) {
    //   const updatedUser = { ...user, tasksCompleted: 0, streak: 0 };
    //   localStorage.setItem('user', JSON.stringify(updatedUser));
    //   setUser(updatedUser);
    // }
    
    setShowResetModal(false);
    setToast({ message: 'Daily task counts reset! Ready for a fresh start! ✨', type: 'success' });
    setTimeout(() => setToast(null), 4000);
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const deleteTask = () => {
    if (!taskToDelete) return;
    const deletedTaskName = taskToDelete.name; // Store name for toast

    setTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
    
    // Also remove from today's progress if it was completed
    setTaskXP(prev => {
      const newTaskXP = { ...prev };
      if (newTaskXP[taskToDelete.id]) {
          delete newTaskXP[taskToDelete.id];
          // Recalculate unique count after deletion
          const uniqueCount = Object.keys(newTaskXP).length;
          setDailyProgress(uniqueCount); 
          saveDailyTaskStatus(newTaskXP); // Save updated status
      }
      return newTaskXP;
    });

    setShowDeleteModal(false);
    setTaskToDelete(null);
    setToast({ message: `Task "${deletedTaskName}" deleted!`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const sectionAnimation = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeInOut" }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          minHeight: "100vh", background: theme.background, color: theme.textPrimary,
          position: "relative", overflow: "hidden"
        }}
      >
        {/* Background elements (Unchanged) */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px", background: `radial-gradient(circle, ${theme.accent}10 0%, transparent 70%)`, borderRadius: "50%", animation: "float 20s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "60%", right: "8%", width: "200px", height: "200px", background: `radial-gradient(circle, ${theme.accentSecondary}10 0%, transparent 70%)`, borderRadius: "50%", animation: "float 25s ease-in-out infinite reverse" }} />

        {/* Header Navigation (Unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: "sticky", top: 0, zIndex: 100, background: theme.navBg, backdropFilter: "blur(20px) saturate(180%)", borderBottom: `1px solid ${theme.border}`, padding: "20px 0" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            {[
              { title: 'Daily Tasks', icon: '📋' }, { title: 'Levels', icon: '🏆' }, { title: 'AI Assistant', icon: '🤖' },
              { title: 'Challenges', icon: '🎮' }, { title: 'Leaderboard', icon: '👑' }, { title: 'Calories', icon: '🔥' }, { title: 'Profile', icon: '👤' }
            ].map((section, index) => (
              <motion.button key={section.title} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveSection(index)}
                style={{ padding: "12px 24px", borderRadius: "15px", border: "none", background: activeSection === index ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})` : theme.cardBg, color: activeSection === index ? "#fff" : theme.textSecondary, fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease" }}>
                <motion.span animate={{ rotate: activeSection === index ? [0, 5, -5, 0] : 0 }} transition={{ duration: 2, repeat: activeSection === index ? Infinity : 0 }}>{section.icon}</motion.span>
                <span>{section.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div style={{ height: "calc(100vh - 100px)", overflowY: "auto", overflowX: "hidden", position: "relative" }}>
          <div style={{ width: "100%", minHeight: "calc(100vh - 100px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "20px", paddingBottom: "50px" }}>
            <div style={{ width: "100%", maxWidth: "1400px", padding: "40px 20px" }}>
              <AnimatePresence mode="wait">
                {/* Daily Tasks Section */}
                {activeSection === 0 && (
                  <motion.div key={0} {...sectionAnimation}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: '100%' }}>
                      {/* Section Header */}
                      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.cardBg, backdropFilter: "blur(20px) saturate(180%)", borderRadius: "25px", padding: "25px 30px", border: `1px solid ${theme.border}` }}>
                        <div>
                          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Daily Tasks</h2>
                          {/* UPDATED Text */}
                          <p style={{ fontSize: "1rem", color: theme.textSecondary, margin: "8px 0 0" }}>{tasks.length} tasks available • {dailyProgress} unique completed today</p>
                        </div>
                        <div style={{ display: "flex", gap: "15px" }}>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowResetModal(true)} style={{ padding: "12px 20px", borderRadius: "15px", border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><span>🔄</span> Reset Daily</motion.button>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAddModal} style={{ padding: "12px 20px", borderRadius: "15px", border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><span>➕</span> Add Task</motion.button>
                        </div>
                      </motion.div>
                      
                      {/* Daily Progress Card (UPDATED) */}
                      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ background: "rgba(59, 130, 246, 0.1)", backdropFilter: "blur(20px) saturate(180%)", borderRadius: "20px", padding: "25px", border: "1px solid rgba(59, 130, 246, 0.2)", boxShadow: "0 8px 32px rgba(59, 130, 246, 0.1)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "1.5rem" }}>📊</span>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0, color: "#3b82f6" }}>Daily Progress</h3>
                          </div>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowProgressResetModal(true)} style={{ padding: "8px 16px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>🔄 Reset</motion.button>
                        </div>

                        {/* Stats Cards Row (UPDATED) */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                          {/* Daily Tasks Progress */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                            style={{ background: "rgba(139, 92, 246, 0.1)", borderRadius: "15px", padding: "15px", border: "1px solid rgba(139, 92, 246, 0.2)", textAlign: "center" }}
                          >
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</div>
                            <h4 style={{ fontSize: "0.9rem", color: "#9ca3af", margin: "0 0 5px 0", fontWeight: "600" }}>Unique Tasks Done</h4>
                            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#8b5cf6" }}>
                              {dailyProgress}/{Math.max(tasks.length, 1)} 
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "5px" }}>
                              {Math.round((dailyProgress / Math.max(tasks.length, 1)) * 100)}% Complete
                            </div>
                          </motion.div>

                          {/* Total XP Gained Today (Logic Unchanged, uses taskXP) */}
                          <motion.div
                             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                            style={{ background: "rgba(251, 191, 36, 0.1)", borderRadius: "15px", padding: "15px", border: "1px solid rgba(251, 191, 36, 0.2)", textAlign: "center" }}
                          >
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⭐</div>
                            <h4 style={{ fontSize: "0.9rem", color: "#9ca3af", margin: "0 0 5px 0", fontWeight: "600" }}>XP Gained Today</h4>
                            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fbbf24" }}>
                              {Object.entries(taskXP).reduce((sum, [taskId, count]) => {
                                const task = tasks.find(t => t.id === taskId);
                                return sum + (count * (task?.xp || 0)); // Safely access xp
                              }, 0)}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "5px" }}>
                              From {Object.values(taskXP).reduce((sum, count) => sum + count, 0)} completions
                            </div>
                          </motion.div>

                          {/* Current Level Progress (Uses userStats from parent) */}
                          <motion.div
                             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                            style={{ background: "rgba(16, 185, 129, 0.1)", borderRadius: "15px", padding: "15px", border: "1px solid rgba(16, 185, 129, 0.2)", textAlign: "center" }}
                          >
                            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🏆</div>
                            <h4 style={{ fontSize: "0.9rem", color: "#9ca3af", margin: "0 0 5px 0", fontWeight: "600" }}>Current Level</h4>
                            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981" }}>
                               Level {userStats.level}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "5px" }}>
                               {userStats.xp} / {userStats.level * 100} XP {/* Assuming 100 XP per level */}
                            </div>
                          </motion.div>
                        </div>

                        {/* Enhanced Progress Bar (UPDATED) */}
                        <div style={{ marginBottom: "15px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", width: "100%" }}>
                            <span style={{ fontSize: "0.9rem", color: "#9ca3af", fontWeight: "600" }}>Daily Task Progress</span>
                            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                              {dailyProgress}/{Math.max(tasks.length, 1)} unique tasks completed
                            </span>
                          </div>

                          <div className="progress-container" style={{ position: "relative", height: "32px", background: "linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(31, 41, 55, 0.9))", borderRadius: "16px", overflow: "hidden", boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(59, 130, 246, 0.15)", border: "2px solid rgba(59, 130, 246, 0.3)", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {/* Main Progress Fill (Enhanced) */}
                            <motion.div
                              className="progress-fill"
                              key={`progress-main-${dailyProgress}-${tasks.length}-${Date.now()}`}
                              initial={{ width: "0%" }}
                              animate={{ width: `${Math.min((dailyProgress / Math.max(tasks.length, 1)) * 100, 100)}%` }}
                              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                              style={{
                                height: "100%",
                                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 30%, #ec4899 60%, #f59e0b 100%)",
                                borderRadius: "16px",
                                position: "absolute",
                                left: 0,
                                top: 0,
                                overflow: "hidden",
                                boxShadow: "0 0 25px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                                transformOrigin: "left center"
                              }}
                            >
                              {/* Animated Gradient Overlay */}
                              <motion.div
                                animate={{ background: ["linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6))", "linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))", "linear-gradient(135deg, rgba(236, 72, 153, 0.6), rgba(245, 158, 11, 0.6))", "linear-gradient(135deg, rgba(245, 158, 11, 0.6), rgba(59, 130, 246, 0.6))"] }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: "16px" }}
                              />
                              {/* Enhanced Shimmer Effect */}
                              <motion.div
                                animate={{ x: ["-150%", "150%"] }}
                                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "40%",
                                  height: "100%",
                                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6), transparent)",
                                  borderRadius: "16px",
                                  filter: "blur(1px)"
                                }}
                              />
                              {/* Pulsing Glow Effect */}
                              <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                  position: "absolute",
                                  top: "-2px",
                                  left: "-2px",
                                  right: "-2px",
                                  bottom: "-2px",
                                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))",
                                  borderRadius: "18px",
                                  filter: "blur(4px)",
                                  zIndex: -1
                                }}
                              />
                              {/* Enhanced Sparkles */}
                              {dailyProgress > 0 && (
                                <>
                                  <motion.div
                                    className="progress-sparkle"
                                    style={{ top: "15%", right: "8%", background: "#ffffff", boxShadow: "0 0 8px rgba(255, 255, 255, 0.9)" }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                  />
                                  <motion.div
                                    className="progress-sparkle"
                                    style={{ top: "65%", right: "20%", background: "#fbbf24", boxShadow: "0 0 10px rgba(251, 191, 36, 0.9)" }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1.2, 0] }}
                                    transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }}
                                  />
                                  <motion.div
                                    className="progress-sparkle"
                                    style={{ top: "35%", right: "35%", background: "#ec4899", boxShadow: "0 0 6px rgba(236, 72, 153, 0.9)", width: "4px", height: "4px" }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 0.8, 0.8, 0] }}
                                    transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
                                  />
                                  <motion.div
                                    className="progress-sparkle"
                                    style={{ top: "80%", right: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.9)", width: "2px", height: "2px" }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.5, 1.5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 1.8 }}
                                  />
                                </>
                              )}
                            </motion.div>

                            {/* Progress Text */}
                            <motion.div
                              key={`progress-text-${dailyProgress}-${Date.now()}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              style={{
                                position: "relative",
                                color: "#fff",
                                fontWeight: "900",
                                fontSize: "0.95rem",
                                textShadow: "0 2px 6px rgba(0, 0, 0, 0.7), 0 0 12px rgba(255, 255, 255, 0.4)",
                                zIndex: 10,
                                textAlign: "center",
                                lineHeight: "32px",
                                padding: "0 4px"
                              }}
                            >
                              {Math.round((dailyProgress / Math.max(tasks.length, 1)) * 100)}%
                            </motion.div>

                            {/* Completion Celebration */}
                            {dailyProgress >= tasks.length && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }}
                                transition={{ duration: 1.8, ease: "easeOut" }}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  fontSize: "1.8rem",
                                  zIndex: 15
                                }}
                              >
                                🎉✨
                              </motion.div>
                            )}
                          </div>

                          {/* Progress Milestones (UPDATED - uses dailyProgress) */}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", width: "100%" }}>
                            {[0, 25, 50, 75, 100].map((milestone) => {
                                const isMilestoneReached = (dailyProgress / Math.max(tasks.length, 1)) * 100 >= milestone;
                                return (
                                    <motion.div
                                    key={`milestone-${milestone}-${dailyProgress}`}
                                    animate={{
                                        scale: isMilestoneReached ? [1, 1.2, 1] : 1,
                                        opacity: isMilestoneReached ? 1 : 0.3
                                    }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        width: "8px", height: "8px", borderRadius: "50%",
                                        background: isMilestoneReached ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255, 255, 255, 0.2)",
                                        boxShadow: isMilestoneReached ? "0 0 8px rgba(59, 130, 246, 0.6)" : "none"
                                    }}
                                    />
                                );
                             })}
                          </div>
                        </div>

                        {/* Motivational Message (UPDATED - uses dailyProgress) */}
                        <motion.div
                          key={`motivation-${dailyProgress}`} // Key updates when dailyProgress changes
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                          style={{
                            fontSize: "0.85rem", color: "#64748b", textAlign: "center", padding: "12px",
                            background: dailyProgress >= tasks.length ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))" : "rgba(255, 255, 255, 0.05)",
                            borderRadius: "12px",
                            border: dailyProgress >= tasks.length ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)"
                          }}
                        >
                          {(() => {
                            const uniqueTasksCompleted = dailyProgress; // Use state directly
                            const allTasksCompleted = uniqueTasksCompleted >= tasks.length;

                            if (uniqueTasksCompleted === 0) {
                              return "🚀 Start your day by completing some tasks!";
                            } else if (allTasksCompleted) {
                              return (
                                <motion.span
                                  animate={{ scale: [1, 1.05, 1], color: ["#64748b", "#10b981", "#059669", "#10b981"] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                >
                                  🎉 FANTASTIC! All {tasks.length} unique tasks completed today! You're absolutely crushing it! 🔥
                                </motion.span>
                              );
                            } else {
                              const remainingTasks = tasks.length - uniqueTasksCompleted;
                              return `💪 Great progress! ${uniqueTasksCompleted}/${tasks.length} unique tasks completed. ${remainingTasks} remaining today. Keep it up!`;
                            }
                          })()}
                        </motion.div>
                      </motion.div>

                      {/* Task Grid (Unchanged) */}
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", width: "100%" }}>
                        <AnimatePresence>
                          {tasks.map((task, index) => (
                            <motion.div
                              key={task.id}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
                              whileHover={{ scale: 1.02, y: -8, boxShadow: `0 15px 40px ${task.color}20` }}
                              style={{
                                background: theme.cardBg, backdropFilter: "blur(20px)", borderRadius: "25px",
                                padding: "25px", border: `2px solid ${task.color}25`, textAlign: "center",
                                position: "relative", overflow: "hidden", cursor: "pointer"
                              }}
                              onClick={() => addXP(task.id, task.xp)}
                            >
                              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{task.icon}</div>
                              <div style={{ fontSize: "1.2rem", fontWeight: "700", color: task.color, marginBottom: "12px" }}>{task.name}</div>
                              <div style={{ background: `linear-gradient(135deg, ${task.color}, ${task.color}cc)`, padding: "8px 16px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "800", color: "#fff", display: "inline-block", marginBottom: "20px" }}>+{task.xp} XP</div>
                              {taskXP[task.id] > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  style={{
                                    position: "absolute", top: "15px", left: "15px", background: `linear-gradient(135deg, ${task.color}, ${task.color}dd)`,
                                    color: "#fff", padding: "6px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "800"
                                  }}
                                >
                                  ✓ {taskXP[task.id]}
                                </motion.div>
                              )}
                              <div style={{ position: "absolute", bottom: "15px", right: "15px", display: "flex", gap: "8px" }}>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); openEditModal(task); }} style={{ background: "rgba(255, 255, 255, 0.1)", border: "none", borderRadius: "10px", padding: "8px", color: "#fff", cursor: "pointer", backdropFilter: "blur(5px)" }}>✏️</motion.button>
                                <motion.button whileHover={{ scale: 1.1, background: "rgba(239, 68, 68, 0.8)" }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); confirmDeleteTask(task); }} style={{ background: "rgba(239, 68, 68, 0.6)", border: "none", borderRadius: "10px", padding: "8px", color: "#fff", cursor: "pointer", backdropFilter: "blur(5px)" }}>🗑️</motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                {/* Other Sections (Passing updated userStats to LevelRoadmap) */}
                {activeSection === 1 && (
                  <motion.div key={1} {...sectionAnimation}>
                      <LevelRoadmap 
                          level={userStats.level} 
                          xp={userStats.xp} 
                          triggerAnimation={roadmapAnimation} 
                      />
                  </motion.div>
                )}
                {activeSection === 2 && (<motion.div key={2} {...sectionAnimation}><AIAssistant /></motion.div>)}
                {activeSection === 3 && (<motion.div key={3} {...sectionAnimation}><Game /></motion.div>)}
                {activeSection === 4 && (
                  <motion.div key={4} {...sectionAnimation}>
                    <Leaderboard user={user} />
                  </motion.div>
                )}
                {activeSection === 5 && (<motion.div key={5} {...sectionAnimation}><CalorieTracker user={user} addXP={addXP} userStats={userStats} setUserStats={setUserStats} /></motion.div>)}
                {activeSection === 6 && (<motion.div key={6} {...sectionAnimation}><UserProfile user={user} setUser={setUser} /></motion.div>)}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* XP Animations (Unchanged) */}
        <AnimatePresence>
          {xpAnimations.map(anim => (
            <motion.div key={anim.id} initial={{ opacity: 1, scale: 0.5, x: anim.x - 30, y: anim.y - 30, color: "#f59e0b" }}
              animate={{ opacity: 0, scale: 1.5, y: anim.y - 120, x: anim.x - 30 + (Math.random() - 0.5) * 60 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{ position: "fixed", fontSize: "1.5rem", fontWeight: "900", pointerEvents: "none", zIndex: 1000 }}>
              +{anim.xp} XP
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Toast Notifications (Unchanged) */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", padding: "16px 30px", borderRadius: "15px", zIndex: 1001, background: toast.type === 'error' ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontWeight: "600" }}>
              <span>{toast.type === 'error' ? '❌' : '✅'}</span> {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CSS Animations (Unchanged) */}
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 35px rgba(139, 92, 246, 0.7), 0 0 45px rgba(236, 72, 153, 0.4); }
          }
          @keyframes progress-sparkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
          }
          .progress-container:hover .progress-fill { animation: pulse-glow 1.8s ease-in-out infinite; }
          .progress-sparkle {
            position: absolute;
            border-radius: 50%;
            animation: progress-sparkle 2s ease-in-out infinite;
            pointer-events: none;
          }
        `}</style>
      </motion.div>

      {/* Modals (Unchanged) */}
      <TaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Task" task={newTask} onTaskChange={setNewTask} onSave={addNewTask} isEdit={false} />
      <TaskModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Task" task={editingTask} onTaskChange={setEditingTask} onSave={editTask} isEdit={true} />
      <ConfirmationModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} onConfirm={resetAllTasks} title="Reset Daily Counts?" message="This will reset today's completion counts for all tasks. This action cannot be undone." confirmText="Reset Daily" icon="🔄" />
      <ConfirmationModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={deleteTask} title="Delete Task?" message={`Are you sure you want to delete the task "${taskToDelete?.name}"? This cannot be undone.`} confirmText="Delete Task" icon="🗑️" />
      <ConfirmationModal isOpen={showProgressResetModal} onClose={() => setShowProgressResetModal(false)} onConfirm={resetDailyProgress} title="Reset Daily Progress?" message="This will clear today's task completion counts and start fresh. This action cannot be undone." confirmText="Reset Progress" icon="🔄" />
    </>
  );
}

export default Dashboard;