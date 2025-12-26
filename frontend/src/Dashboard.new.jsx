import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import { useXP } from './hooks/useXP';
import { calculateLevel } from './lib/utils';
import { db } from "./firebase";
import { CheckCircle2, Circle, Plus, Sparkles, Zap, AlertTriangle } from "lucide-react";
import Game from "./Game";
import Expenses from "./Expenses";
import LevelRoadmap from "./LevelRoadmap";
import Leaderboard from "./Leaderboard";
import CalorieTracker from "./CalorieTracker";
import UserProfile from "./UserProfile";
import AIAssistant from "./AIAssistant";
import CalendarSection from "./CalendarSection";
import CircularProgress from './components/CircularProgress';
import HabitIcon from './components/HabitIcon';

// Sidebar Component
const Sidebar = ({ activeSection, setActiveSection, userStats }) => {
  return (
    <div style={{
      width: '250px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: '#fff',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      padding: '20px',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2>Dashboard</h2>
        <div style={{ marginTop: '10px' }}>
          <CircularProgress 
            progress={(userStats.xp / (userStats.level * 100)) * 100} 
            size={80} 
            color="#8B7FC7" 
          />
          <div style={{ marginTop: '10px' }}>
            <div>Level {userStats.level}</div>
            <div>{userStats.xp} XP</div>
          </div>
        </div>
      </div>
      
      <nav>
        {['Dashboard', 'Roadmap', 'AI Assistant', 'Expenses', 'Leaderboard', 'Calories', 'Profile'].map((item, index) => (
          <button
            key={item}
            onClick={() => setActiveSection(index)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              margin: '5px 0',
              textAlign: 'left',
              border: 'none',
              background: activeSection === index ? '#f0f0f0' : 'transparent',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ user, setUser, token }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [toast, setToast] = useState(null);
  const [xpAnimations, setXpAnimations] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 'exercise', name: 'Exercise', xp: 20, icon: 'dumbbell', color: '#8b5cf6', category: 'Fitness', description: 'Complete your daily workout' },
    { id: 'hydration', name: 'Drink Water', xp: 15, icon: 'droplet', color: '#60a5fa', category: 'Health', description: 'Stay hydrated (8 glasses)' },
    { id: 'reading', name: 'Read', xp: 25, icon: 'book', color: '#f59e0b', category: 'Learning', description: 'Read for 30 minutes' },
    { id: 'meditation', name: 'Meditate', xp: 20, icon: 'moon', color: '#10b981', category: 'Mindfulness', description: 'Meditate for 10 minutes' },
    { id: 'coding', name: 'Code', xp: 30, icon: 'laptop', color: '#ec4899', category: 'Skills', description: 'Work on coding project' },
    { id: 'planning', name: 'Plan Day', xp: 15, icon: 'calendar', color: '#8b5cf6', category: 'Productivity', description: 'Plan your tasks for the day' }
  ]);
  const [taskXP, setTaskXP] = useState({});
  const [dailyProgress, setDailyProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProgressResetModal, setShowProgressResetModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', xp: 10, icon: 'circle', color: '#6b7280' });
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [roadmapAnimation, setRoadmapAnimation] = useState(false);

  // Use the useXP hook
  const {
    xp,
    level,
    streak,
    tasksCompleted,
    isLoading: isLoadingXP,
    error: xpError,
    addXP: addXPService
  } = useXP(user, setUser);

  // Initialize user stats
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    tasksCompleted: 0,
    skillsUnlocked: 0,
    mindfulMinutes: 0
  });

  // Animation variants
  const sectionAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  // Theme
  const pastelTheme = {
    primary: '#8B7FC7',
    secondary: '#6A5ACD',
    background: '#f8f9fa',
    textPrimary: '#333',
    textSecondary: '#666',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  // Glassmorphic style
  const glassmorphicStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
  };

  // Card style
  const cardStyle = {
    ...glassmorphicStyle,
    padding: "24px",
    margin: "16px",
    borderRadius: "20px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  // Add XP function
  const addXP = useCallback(async (taskId, xpToAdd, clickPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }) => {
    try {
      // Add XP using the service
      const result = await addXPService(xpToAdd, taskId);
      
      // Show toast for XP gain or level up
      if (result.leveledUp) {
        setToast({ message: `🎉 Level Up! Reached Level ${result.level}!`, type: 'success' });
        setRoadmapAnimation(true);
        setTimeout(() => setRoadmapAnimation(false), 2000);
      } else {
        setToast({ message: `+${xpToAdd} XP Gained!`, type: 'success' });
      }
      setTimeout(() => setToast(null), 3000);

      // Add XP animation
      const animationId = Date.now();
      const newAnimation = { 
        id: animationId, 
        xp: xpToAdd, 
        x: clickPosition.x - 30, 
        y: clickPosition.y - 30 
      };
      setXpAnimations((prev) => [...prev, newAnimation]);
      setTimeout(
        () => setXpAnimations((prev) => prev.filter((anim) => anim.id !== animationId)), 
        2500
      );

      // Update task completion status if this is from a task
      if (taskId) {
        setTaskXP(prev => {
          const newTaskXP = { ...prev, [taskId]: (prev[taskId] || 0) + 1 };
          const completedCount = Object.keys(newTaskXP).filter(id => newTaskXP[id] > 0).length;
          setDailyProgress(completedCount);
          return newTaskXP;
        });
      }
    } catch (error) {
      console.error('Error adding XP:', error);
      setToast({ 
        message: error.message || 'Failed to add XP. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setToast(null), 3000);
    }
  }, [addXPService]);

  // Handle task completion
  const handleTaskComplete = (task, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    addXP(task.id, task.xp, clickPosition);
  };

  // Reset daily progress
  const resetDailyProgress = () => {
    setTaskXP({});
    setDailyProgress(0);
    setShowProgressResetModal(false);
    setToast({ message: 'Daily progress has been reset.', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  // Add new task
  const addNewTask = () => {
    if (!newTask.name.trim()) return;
    
    const task = {
      ...newTask,
      id: newTask.name.toLowerCase().replace(/\s+/g, '-'),
      xp: parseInt(newTask.xp) || 10
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({ name: '', description: '', xp: 10, icon: 'circle', color: '#6b7280' });
    setShowAddModal(false);
    setToast({ message: 'Task added successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  // Edit task
  const editTask = () => {
    if (!editingTask?.name.trim()) return;
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id 
          ? { ...editingTask, xp: parseInt(editingTask.xp) || 10 }
          : task
      )
    );
    
    setShowEditModal(false);
    setToast({ message: 'Task updated successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  // Delete task
  const deleteTask = () => {
    if (!taskToDelete) return;
    
    setTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
    setShowDeleteModal(false);
    setToast({ message: 'Task deleted successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  // Reset all tasks
  const resetAllTasks = () => {
    setTasks([
      { id: 'exercise', name: 'Exercise', xp: 20, icon: 'dumbbell', color: '#8b5cf6', category: 'Fitness', description: 'Complete your daily workout' },
      { id: 'hydration', name: 'Drink Water', xp: 15, icon: 'droplet', color: '#60a5fa', category: 'Health', description: 'Stay hydrated (8 glasses)' },
      { id: 'reading', name: 'Read', xp: 25, icon: 'book', color: '#f59e0b', category: 'Learning', description: 'Read for 30 minutes' },
      { id: 'meditation', name: 'Meditate', xp: 20, icon: 'moon', color: '#10b981', category: 'Mindfulness', description: 'Meditate for 10 minutes' },
      { id: 'coding', name: 'Code', xp: 30, icon: 'laptop', color: '#ec4899', category: 'Skills', description: 'Work on coding project' },
      { id: 'planning', name: 'Plan Day', xp: 15, icon: 'calendar', color: '#8b5cf6', category: 'Productivity', description: 'Plan your tasks for the day' }
    ]);
    setShowResetModal(false);
    setToast({ message: 'All tasks have been reset to default.', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  // Update user stats when XP changes
  useEffect(() => {
    setUserStats(prev => ({
      ...prev,
      xp: xp,
      level: level,
      streak: streak,
      tasksCompleted: tasksCompleted
    }));
  }, [xp, level, streak, tasksCompleted]);

  // Main render
  return (
    <div style={{ minHeight: '100vh', backgroundColor: pastelTheme.background, position: 'relative' }}>
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        userStats={userStats}
      />

      {/* Main Content */}
      <div style={{ 
        marginLeft: sidebarVisible ? '250px' : '80px',
        transition: 'margin 0.3s ease',
        minHeight: '100vh',
        backgroundColor: pastelTheme.background
      }}>
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setSidebarVisible(!sidebarVisible)}
          style={{
            position: 'fixed',
            top: '20px',
            left: sidebarVisible ? '220px' : '20px',
            zIndex: 1000,
            background: pastelTheme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          {sidebarVisible ? '☰' : '✕'}
        </button>

        {/* Page Content */}
        <div style={{ padding: '20px', paddingTop: '80px' }}>
          <AnimatePresence mode="wait">
            {/* Dashboard Section */}
            {activeSection === 0 && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h1 style={{ margin: 0, fontSize: '1.8rem', color: pastelTheme.textPrimary }}>
                    My Dashboard
                  </h1>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: '#f0f0f0',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Sparkles size={18} color={pastelTheme.primary} />
                      <span style={{ fontWeight: '600' }}>{userStats.xp} XP</span>
                    </div>
                    <div style={{
                      backgroundColor: '#f0f0f0',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Zap size={18} color={pastelTheme.primary} />
                      <span style={{ fontWeight: '600' }}>Level {userStats.level}</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Section */}
                <CalendarSection 
                  user={user}
                  userStats={userStats} 
                  tasks={tasks}
                  dailyProgress={dailyProgress}
                  taskXP={taskXP}
                  onResetDaily={() => setShowProgressResetModal(true)}
                />

                {/* Task Grid */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '24px',
                  marginTop: '24px'
                }}>
                  {tasks.map((task) => {
                    const completionCount = taskXP[task.id] || 0;
                    const isCompleted = completionCount > 0;
                    
                    return (
                      <motion.div
                        key={task.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleTaskComplete(task, e)}
                        style={{
                          ...cardStyle,
                          cursor: 'pointer',
                          borderLeft: `4px solid ${task.color}`,
                          opacity: isCompleted ? 0.7 : 1,
                          transform: isCompleted ? 'scale(0.98)' : 'scale(1)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <HabitIcon icon={task.icon} color={task.color} size="md" />
                          {isCompleted && (
                            <div style={{
                              backgroundColor: pastelTheme.success + '20',
                              color: pastelTheme.success,
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <CheckCircle2 size={14} />
                              Completed
                            </div>
                          )}
                        </div>
                        
                        <h3 style={{ margin: '0 0 8px 0', color: pastelTheme.textPrimary }}>{task.name}</h3>
                        <p style={{ margin: '0 0 16px 0', color: pastelTheme.textSecondary, fontSize: '0.9rem' }}>
                          {task.description}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            backgroundColor: task.color + '20',
                            color: task.color,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {task.category}
                          </span>
                          
                          <div style={{
                            backgroundColor: pastelTheme.primary + '20',
                            color: pastelTheme.primary,
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Zap size={14} />
                            +{task.xp} XP
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Level Roadmap Section */}
            {activeSection === 1 && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LevelRoadmap level={userStats.level} xp={userStats.xp} triggerAnimation={roadmapAnimation} />
              </motion.div>
            )}

            {/* AI Assistant Section */}
            {activeSection === 2 && (
              <motion.div
                key="ai-assistant"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AIAssistant addXP={addXP} />
              </motion.div>
            )}

            {/* Expenses Section */}
            {activeSection === 3 && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Expenses addXP={addXP} />
              </motion.div>
            )}

            {/* Leaderboard Section */}
            {activeSection === 4 && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Leaderboard user={user} />
              </motion.div>
            )}

            {/* Calorie Tracker Section */}
            {activeSection === 5 && (
              <motion.div
                key="calories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CalorieTracker user={user} addXP={addXP} userStats={userStats} setUserStats={setUserStats} />
              </motion.div>
            )}

            {/* Profile Section */}
            {activeSection === 6 && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <UserProfile user={user} setUser={setUser} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* XP Animations */}
        <AnimatePresence>
          {xpAnimations.map(anim => (
            <motion.div
              key={anim.id}
              initial={{ opacity: 1, x: anim.x, y: anim.y, scale: 1 }}
              animate={{ 
                opacity: 0, 
                y: anim.y - 100,
                x: anim.x + (Math.random() * 40 - 20),
                scale: 1.5
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 1000,
                color: pastelTheme.primary,
                fontWeight: 'bold',
                fontSize: '1.2rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              +{anim.xp} XP
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Toast Notifications */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: toast.type === 'error' ? '#ffebee' : '#e8f5e9',
                color: toast.type === 'error' ? '#c62828' : '#2e7d32',
                padding: '12px 24px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 1000
              }}
            >
              {toast.type === 'error' ? (
                <AlertTriangle size={20} color="#c62828" />
              ) : (
                <CheckCircle2 size={20} color="#2e7d32" />
              )}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <div className="modals-container">
        {/* Add Task Modal */}
        <div className={`modal ${showAddModal ? 'active' : ''}`}>
          <div className="modal-content">
            <h3>Add New Task</h3>
            <div className="form-group">
              <label>Task Name</label>
              <input 
                type="text" 
                value={newTask.name}
                onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                placeholder="Enter task name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Enter task description"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>XP Reward</label>
              <input 
                type="number" 
                value={newTask.xp}
                onChange={(e) => setNewTask({...newTask, xp: parseInt(e.target.value) || 0})}
                min="1"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <select 
                value={newTask.icon}
                onChange={(e) => setNewTask({...newTask, icon: e.target.value})}
              >
                <option value="dumbbell">Dumbbell</option>
                <option value="droplet">Water</option>
                <option value="book">Book</option>
                <option value="moon">Moon</option>
                <option value="laptop">Laptop</option>
                <option value="calendar">Calendar</option>
              </select>
            </div>
            <div className="form-group">
              <label>Color</label>
              <input 
                type="color" 
                value={newTask.color}
                onChange={(e) => setNewTask({...newTask, color: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={addNewTask}
                disabled={!newTask.name.trim()}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Edit Task Modal */}
        <div className={`modal ${showEditModal ? 'active' : ''}`}>
          <div className="modal-content">
            <h3>Edit Task</h3>
            {editingTask && (
              <>
                <div className="form-group">
                  <label>Task Name</label>
                  <input 
                    type="text" 
                    value={editingTask.name}
                    onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                    placeholder="Enter task name"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    placeholder="Enter task description"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>XP Reward</label>
                  <input 
                    type="number" 
                    value={editingTask.xp}
                    onChange={(e) => setEditingTask({...editingTask, xp: parseInt(e.target.value) || 0})}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={editTask}
                    disabled={!editingTask.name.trim()}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Confirmation Modals */}
        <div className={`modal ${showResetModal ? 'active' : ''}`}>
          <div className="modal-content">
            <h3>Reset All Tasks?</h3>
            <p>This will reset all tasks to their default values. This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={resetAllTasks}
              >
                Reset All Tasks
              </button>
            </div>
          </div>
        </div>

        <div className={`modal ${showDeleteModal ? 'active' : ''}`}>
          <div className="modal-content">
            <h3>Delete Task?</h3>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={deleteTask}
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>

        <div className={`modal ${showProgressResetModal ? 'active' : ''}`}>
          <div className="modal-content">
            <h3>Reset Daily Progress?</h3>
            <p>This will clear your progress for today. This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowProgressResetModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={resetDailyProgress}
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        .fade-enter {
          opacity: 0;
        }
        .fade-enter-active {
          opacity: 1;
          transition: opacity 300ms ease-in;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transition: opacity 300ms ease-in;
        }
        
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }
        
        .modal.active {
          display: flex;
        }
        
        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: #8B7FC7;
          color: white;
        }
        
        .btn-primary:hover {
          background: #7a6fbb;
        }
        
        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }
        
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        
        .btn-danger:hover {
          background: #dc2626;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
