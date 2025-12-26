import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const CalendarSection = ({ user, userStats, tasks, dailyProgress, onResetDaily, taskXP }) => {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState('DAY');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [reminders, setReminders] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentReminder, setCurrentReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [motivationQuote, setMotivationQuote] = useState('');
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [audioRefs, setAudioRefs] = useState({});
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());
  
  // Calculate XP Today
  const xpToday = taskXP ? Object.entries(taskXP).reduce((sum, [taskId, count]) => {
    const task = tasks.find(t => t.id === taskId);
    return sum + (count * (task?.xp || 0));
  }, 0) : 0;

  // Daily motivation quotes
  const quotes = [
    "Today is your opportunity to build the tomorrow you want. 🌟",
    "Small steps every day lead to big changes. Keep going! 💪",
    "Your only limit is you. Be brave and fearless. 🚀",
    "Success is the sum of small efforts repeated day in and day out. ✨",
    "Believe in yourself and all that you are. 🌈",
    "The secret of getting ahead is getting started. 🎯",
    "Don't watch the clock; do what it does. Keep going. ⏰",
    "You are stronger than you think. Keep pushing forward! 💎",
    "Dream big, start small, act now. 🌠",
    "Progress, not perfection. Every step counts! 🎨"
  ];

  useEffect(() => {
    // Set daily quote based on date
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setMotivationQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  // Calculate completed tasks percentage
  const completionPercentage = tasks && tasks.length > 0 
    ? Math.round((dailyProgress / tasks.length) * 100) 
    : 0;

  // Get days in current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDayOfMonth, year, month };
  };

  const { daysInMonth, firstDayOfMonth, year, month } = getDaysInMonth(currentDate);

  // Generate days array for horizontal scroll
  const generateDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const isToday = i === today.getDate() && month === currentMonth && year === currentYear;
      const dateKey = `${year}-${month}-${i}`;
      const hasNote = notes[dateKey] || reminders[dateKey];
      
      days.push({
        day: i,
        dayName,
        isToday,
        hasNote,
        dateKey
      });
    }
    
    return days;
  };

  const days = generateDays();

  const handleDateClick = (dayInfo) => {
    setSelectedDate(dayInfo.dateKey);
    setCurrentNote(notes[dayInfo.dateKey]?.text || '');
    setCurrentReminder(reminders[dayInfo.dateKey]?.text || '');
    setReminderTime(reminders[dayInfo.dateKey]?.time || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    if (selectedDate) {
      // Save note
      if (currentNote.trim()) {
        setNotes({ ...notes, [selectedDate]: { text: currentNote.trim(), addedAt: Date.now() } });
        
        // Add note to todo list
        const savedTodos = JSON.parse(localStorage.getItem('dashboardTodos') || '[]');
        const newTodo = {
          id: Date.now(),
          text: `📝 ${currentNote.trim()} (from ${new Date(selectedDate.split('-')[0], selectedDate.split('-')[1], selectedDate.split('-')[2]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
          completed: false
        };
        savedTodos.push(newTodo);
        localStorage.setItem('dashboardTodos', JSON.stringify(savedTodos));
        window.dispatchEvent(new Event('storage')); // Trigger update
      }
      
      // Save reminder with time
      if (currentReminder.trim()) {
        const reminderData = {
          text: currentReminder.trim(),
          time: reminderTime,
          date: selectedDate,
          id: Date.now()
        };
        setReminders({ ...reminders, [selectedDate]: reminderData });
        
        // If time is set, schedule notification
        if (reminderTime) {
          scheduleNotification(reminderData);
        }
      }
      
      setShowNoteModal(false);
      setSelectedDate(null);
      setCurrentNote('');
      setCurrentReminder('');
      setReminderTime('');
    }
  };

  const deleteNote = () => {
    if (selectedDate) {
      const newNotes = { ...notes };
      const newReminders = { ...reminders };
      delete newNotes[selectedDate];
      delete newReminders[selectedDate];
      setNotes(newNotes);
      setReminders(newReminders);
      setShowNoteModal(false);
      setSelectedDate(null);
      setCurrentNote('');
      setCurrentReminder('');
      setReminderTime('');
    }
  };

  // Schedule notification for reminder
  const scheduleNotification = (reminderData) => {
    if (!reminderData.time) return;
    
    const [hours, minutes] = reminderData.time.split(':');
    const [year, month, day] = reminderData.date.split('-');
    const reminderDateTime = new Date(parseInt(year), parseInt(month), parseInt(day), parseInt(hours), parseInt(minutes));
    const now = new Date();
    const timeUntilReminder = reminderDateTime - now;
    
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        showNotification(reminderData);
      }, timeUntilReminder);
    }
  };

  // Show notification with sound
  const showNotification = (reminderData) => {
    // Check if already dismissed
    if (dismissedNotifications.has(reminderData.id)) {
      return;
    }

    const notification = {
      id: reminderData.id,
      text: reminderData.text,
      time: reminderData.time
    };
    
    setActiveNotifications(prev => [...prev, notification]);
    
    // Create alarm sound using Web Audio API - play once only
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create three quick beeps for alarm sound
    for (let i = 0; i < 3; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.type = 'square'; // Square wave for alarm-like sound
      osc.frequency.setValueAtTime(880, audioContext.currentTime + (i * 0.15)); // A5 note
      
      gain.gain.setValueAtTime(0, audioContext.currentTime + (i * 0.15));
      gain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + (i * 0.15) + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (i * 0.15) + 0.1);
      
      osc.start(audioContext.currentTime + (i * 0.15));
      osc.stop(audioContext.currentTime + (i * 0.15) + 0.1);
    }
    
    setAudioRefs(prev => ({ ...prev, [notification.id]: { context: audioContext } }));
  };

  // Dismiss notification
  const dismissNotification = (notificationId) => {
    // Close audio context if exists
    if (audioRefs[notificationId]) {
      if (audioRefs[notificationId].context) {
        audioRefs[notificationId].context.close();
      }
    }
    
    // Mark as dismissed
    setDismissedNotifications(prev => new Set([...prev, notificationId]));
    
    // Remove notification
    setActiveNotifications(prev => prev.filter(n => n.id !== notificationId));
    setAudioRefs(prev => {
      const newRefs = { ...prev };
      delete newRefs[notificationId];
      return newRefs;
    });
  };

  // Check for due reminders on mount and every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      Object.entries(reminders).forEach(([dateKey, reminderData]) => {
        if (reminderData.time) {
          const [hours, minutes] = reminderData.time.split(':');
          const [year, month, day] = dateKey.split('-');
          const reminderDateTime = new Date(parseInt(year), parseInt(month), parseInt(day), parseInt(hours), parseInt(minutes));
          
          // Show notification if within 1 minute of reminder time
          const timeDiff = Math.abs(now - reminderDateTime);
          if (timeDiff < 60000 && !activeNotifications.find(n => n.id === reminderData.id)) {
            showNotification(reminderData);
          }
        }
      });
    };
    
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [reminders]);

  // View buttons
  const viewOptions = ['WEEK', 'MONTH', 'YEAR'];

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    }}>
      {/* Today's Progress Section with Stats on Side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        {/* Welcome Text */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#2D3748',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome back, {user?.displayName || user?.name || 'Explorer'}!
        </motion.h2>

        {/* Progress Circle with Side Stats */}
        <div className="progress-with-stats" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          marginBottom: '30px',
        }}>
          {/* Progress Circle Container - Simplified */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              display: 'inline-block',
              position: 'relative',
              width: '240px',
              height: '240px',
            }}
          >
            {/* Animated wave rings */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '2px solid #8B7FC7',
                pointerEvents: 'none',
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '2px solid #8B7FC7',
                pointerEvents: 'none',
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '2px solid #8B7FC7',
                pointerEvents: 'none',
              }}
            />
            
            <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'relative', zIndex: 1 }}>
              {/* Background circle */}
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="20"
              />
              
              {/* Progress circle - solid purple */}
              <motion.circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="#8B7FC7"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={628}
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: 628 - (628 * completionPercentage / 100) }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                }}
              />
            </svg>
            
            {/* Center text */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  color: '#2D3748',
                  lineHeight: 1,
                }}
              >
                {completionPercentage}%
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{
                  fontSize: '0.9rem',
                  color: '#718096',
                  marginTop: '8px',
                }}
              >
                Complete
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards on the Side */}
          <div className="stats-side" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                padding: '16px 24px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid rgba(139, 127, 199, 0.2)',
                boxShadow: '0 4px 12px rgba(139, 127, 199, 0.15)',
                minWidth: '200px',
              }}
            >
              <div style={{
                fontSize: '0.75rem',
                color: '#718096',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}>
                XP Today
              </div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: '#8B7FC7',
              }}>
                {xpToday}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              style={{
                padding: '16px 24px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid rgba(139, 127, 199, 0.2)',
                boxShadow: '0 4px 12px rgba(139, 127, 199, 0.15)',
                minWidth: '200px',
              }}
            >
              <div style={{
                fontSize: '0.75rem',
                color: '#718096',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}>
                Streak
              </div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: '#8B7FC7',
              }}>
                {userStats?.streak || 0}d
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(139, 127, 199, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetDaily}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '2px solid rgba(139, 127, 199, 0.3)',
                background: 'linear-gradient(135deg, rgba(139, 127, 199, 0.15), rgba(167, 139, 250, 0.15))',
                color: '#8B7FC7',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(139, 127, 199, 0.2)',
              }}
            >
              Reset Daily
            </motion.button>
          </div>
        </div>

        {/* Daily Motivation Quote */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 127, 199, 0.1), rgba(212, 241, 244, 0.15))',
            padding: '20px 30px',
            borderRadius: '20px',
            border: '2px solid rgba(139, 127, 199, 0.2)',
            boxShadow: '0 4px 15px rgba(139, 127, 199, 0.1)',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <p style={{
            fontSize: '1.1rem',
            color: '#2D3748',
            fontWeight: '500',
            margin: 0,
            fontStyle: 'italic',
          }}>
            "{motivationQuote}"
          </p>
        </motion.div>
      </motion.div>

      {/* View Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}
      >
        {viewOptions.map((view) => (
          <motion.button
            key={view}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView(view)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: currentView === view ? '2px solid #8B7FC7' : '2px solid transparent',
              background: currentView === view 
                ? 'linear-gradient(135deg, #8B7FC7, #A78BFA)' 
                : 'rgba(255, 255, 255, 0.8)',
              color: currentView === view ? '#fff' : '#718096',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: currentView === view 
                ? '0 4px 12px rgba(139, 127, 199, 0.3)' 
                : '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
            }}
          >
            {view}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: '2px solid rgba(139, 127, 199, 0.2)',
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#718096',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
          }}
        >
          📅
        </motion.button>
      </motion.div>

      {/* Calendar View Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, rgba(232, 213, 242, 0.15), rgba(255, 255, 255, 0.95))',
          borderRadius: '24px',
          padding: '30px 20px',
          border: '2px solid rgba(139, 127, 199, 0.2)',
          boxShadow: '0 8px 30px rgba(139, 127, 199, 0.12)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#2D3748',
            margin: 0,
          }}>
            {currentView === 'DAY' ? 'Today' : currentView === 'WEEK' ? 'This Week' : currentView === 'MONTH' ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : currentDate.getFullYear()}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentView !== 'DAY' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentView === 'WEEK') {
                      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
                    } else if (currentView === 'MONTH') {
                      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                    } else if (currentView === 'YEAR') {
                      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
                    }
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(139, 127, 199, 0.1)',
                    color: '#8B7FC7',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  ◀
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentView === 'WEEK') {
                      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
                    } else if (currentView === 'MONTH') {
                      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                    } else if (currentView === 'YEAR') {
                      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
                    }
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(139, 127, 199, 0.1)',
                    color: '#8B7FC7',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  ▶
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date())}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(139, 127, 199, 0.1)',
                color: '#8B7FC7',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              🔄
            </motion.button>
          </div>
        </div>

        {/* DAY View - Horizontal Scroll */}
        {currentView === 'DAY' && (
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            paddingBottom: '10px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: '#8B7FC7 rgba(139, 127, 199, 0.1)',
          }}>
            {days.map((dayInfo, index) => (
            <motion.div
              key={dayInfo.dateKey}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + (index * 0.03), duration: 0.3 }}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateClick(dayInfo)}
              style={{
                minWidth: '80px',
                padding: '20px 16px',
                borderRadius: '16px',
                background: dayInfo.isToday 
                  ? 'linear-gradient(135deg, #8B7FC7, #A78BFA)' 
                  : dayInfo.hasNote
                  ? 'rgba(139, 127, 199, 0.15)'
                  : 'rgba(255, 255, 255, 0.7)',
                border: dayInfo.isToday 
                  ? '2px solid #8B7FC7' 
                  : dayInfo.hasNote
                  ? '2px solid rgba(139, 127, 199, 0.3)'
                  : '2px solid rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: dayInfo.isToday 
                  ? '0 6px 20px rgba(139, 127, 199, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: dayInfo.isToday ? '#fff' : '#718096',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}>
                {dayInfo.dayName}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: dayInfo.isToday ? '#fff' : '#2D3748',
              }}>
                {dayInfo.day.toString().padStart(2, '0')}
              </div>
              {dayInfo.hasNote && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: reminders[dayInfo.dateKey] ? '#A78BFA' : '#8B5CF6',
                }} />
              )}
            </motion.div>
          ))}
        </div>
        )}

        {/* WEEK View */}
        {currentView === 'WEEK' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const weekStart = new Date(currentDate);
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());
              const date = new Date(weekStart);
              date.setDate(date.getDate() + i);
              const isToday = date.toDateString() === new Date().toDateString();
              const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDateClick({ dateKey, day: date.getDate() })}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: isToday ? 'linear-gradient(135deg, #8B7FC7, #A78BFA)' : 'rgba(255, 255, 255, 0.7)',
                    border: '2px solid ' + (isToday ? '#8B7FC7' : 'rgba(139, 127, 199, 0.2)'),
                    cursor: 'pointer',
                    textAlign: 'center',
                    boxShadow: isToday ? '0 6px 20px rgba(139, 127, 199, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: isToday ? '#fff' : '#718096', marginBottom: '8px', fontWeight: '600' }}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '700', color: isToday ? '#fff' : '#2D3748' }}>
                    {date.getDate()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* MONTH View */}
        {currentView === 'MONTH' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px', textAlign: 'center' }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                <div key={idx} style={{ fontSize: '0.75rem', fontWeight: '600', color: '#718096', padding: '8px' }}>
                  {day}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} style={{ height: '60px' }} />
              ))}
              {days.map((dayInfo, index) => {
                const isToday = dayInfo.isToday;
                return (
                  <motion.div
                    key={dayInfo.dateKey}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01, duration: 0.2 }}
                    whileHover={{ scale: 1.08 }}
                    onClick={() => handleDateClick(dayInfo)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '12px',
                      background: isToday ? 'linear-gradient(135deg, #8B7FC7, #A78BFA)' : dayInfo.hasNote ? 'rgba(139, 127, 199, 0.15)' : 'rgba(255, 255, 255, 0.7)',
                      border: '2px solid ' + (isToday ? '#8B7FC7' : dayInfo.hasNote ? 'rgba(139, 127, 199, 0.3)' : 'rgba(0, 0, 0, 0.05)'),
                      cursor: 'pointer',
                      textAlign: 'center',
                      minHeight: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: isToday ? '#fff' : '#2D3748',
                      position: 'relative',
                    }}
                  >
                    {dayInfo.day}
                    {dayInfo.hasNote && (
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: reminders[dayInfo.dateKey] ? '#A78BFA' : '#8B5CF6',
                      }} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* YEAR View */}
        {currentView === 'YEAR' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {Array.from({ length: 12 }).map((_, monthIndex) => {
              const monthDate = new Date(currentDate.getFullYear(), monthIndex, 1);
              const monthDays = new Date(currentDate.getFullYear(), monthIndex + 1, 0).getDate();
              const firstDay = monthDate.getDay();
              
              return (
                <motion.div
                  key={monthIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: monthIndex * 0.05, duration: 0.3 }}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#2D3748', marginBottom: '12px', textAlign: 'center' }}>
                    {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', fontSize: '0.65rem' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={i} style={{ textAlign: 'center', color: '#718096', fontWeight: '600' }}>{d}</div>
                    ))}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`e-${i}`} />
                    ))}
                    {Array.from({ length: monthDays }).map((_, day) => {
                      const isCurrentMonth = monthIndex === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                      const isToday = isCurrentMonth && day + 1 === new Date().getDate();
                      return (
                        <div
                          key={day}
                          style={{
                            padding: '4px',
                            borderRadius: '6px',
                            textAlign: 'center',
                            background: isToday ? '#8B7FC7' : 'transparent',
                            color: isToday ? '#fff' : '#2D3748',
                            fontWeight: isToday ? '700' : '500',
                            fontSize: '0.7rem',
                          }}
                        >
                          {day + 1}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowNoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '24px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(139, 127, 199, 0.2)',
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#2D3748',
                marginBottom: '20px',
              }}>
                📝 {selectedDate ? new Date(selectedDate.split('-')[0], selectedDate.split('-')[1], selectedDate.split('-')[2]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Add Note'}
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Notes
                </label>
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Write your notes here..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#2D3748',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Reminders
                </label>
                <textarea
                  value={currentReminder}
                  onChange={(e) => setCurrentReminder(e.target.value)}
                  placeholder="Set reminders..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#2D3748',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    marginBottom: '12px',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#4B5563',
                    whiteSpace: 'nowrap',
                  }}>
                    ⏰ Time:
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '2px solid rgba(139, 127, 199, 0.2)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      color: '#2D3748',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteNote}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '2px solid #EF4444',
                    background: 'transparent',
                    color: '#EF4444',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNoteModal(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.3)',
                    background: 'transparent',
                    color: '#718096',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(139, 127, 199, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveNote}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8B7FC7, #A78BFA)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 127, 199, 0.3)',
                  }}
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Badges */}
      <AnimatePresence>
        {activeNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            style={{
              position: 'fixed',
              top: `${20 + index * 110}px`,
              right: '20px',
              zIndex: 2000,
              background: 'linear-gradient(135deg, #8B7FC7, #A78BFA)',
              borderRadius: '16px',
              padding: '20px 24px',
              minWidth: '320px',
              maxWidth: '400px',
              boxShadow: '0 10px 40px rgba(139, 127, 199, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              animation: 'pulse 2s infinite',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🔔</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Reminder
                  </span>
                </div>
                <p style={{
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4',
                }}>
                  {notification.text}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}>
                  <span>⏰</span>
                  <span>{notification.time}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dismissNotification(notification.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  color: '#fff',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  minWidth: '80px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                Dismiss
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Responsive Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @media (max-width: 768px) {
          .calendar-section h2 {
            font-size: 1.5rem !important;
          }
          
          .calendar-section p {
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 480px) {
          .calendar-section {
            padding: 15px !important;
          }
          
          .calendar-section h2 {
            font-size: 1.3rem !important;
          }
        }

        /* Responsive layout for progress circle and stats */
        @media (max-width: 768px) {
          .progress-with-stats {
            flex-direction: column !important;
            gap: 20px !important;
          }
          
          .stats-side {
            flex-direction: row !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          
          .stats-side > * {
            min-width: 150px !important;
            flex: 1 !important;
          }
        }

        /* Responsive grid for different views */
        @media (max-width: 768px) {
          [style*="gridTemplateColumns: 'repeat(7, 1fr)'"] {
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 4px !important;
          }
          
          [style*="gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'"] {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          }
        }

        @media (max-width: 480px) {
          [style*="gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'"] {
            grid-template-columns: 1fr !important;
          }
          
          [style*="gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'"] {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
          }
        }

        /* Custom scrollbar for days container */
        div::-webkit-scrollbar {
          height: 8px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(139, 127, 199, 0.1);
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb {
          background: #8B7FC7;
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #7A6FB6;
        }

        /* Smooth transitions */
        * {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CalendarSection;
