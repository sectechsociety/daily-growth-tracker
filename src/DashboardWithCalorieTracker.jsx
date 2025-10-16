import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalorieDashboard from "./src/components/CalorieDashboard";
import AIAssistant from "./AIAssistant";
import LevelRoadmap from "./LevelRoadmap";
import Leaderboard from "./Leaderboard";
import Profile from "./ProfilePage";

// Main dashboard component with integrated AI Assistant and Calorie Tracker

function DashboardWithCalorieTracker() {
  const [activeSection, setActiveSection] = useState(0);
  
  // Navigation items - Add Calorie Tracker to the list
  const navItems = [
    { title: 'Daily Tasks', icon: '📋', color: '#60a5fa' },
    { title: 'Calorie Tracker', icon: '🔥', color: '#ff6b6b' },
    { title: 'Levels', icon: '🏆', color: '#f59e0b' },
    { title: 'AI Assistant', icon: '🤖', color: '#8b5cf6' },
    { title: 'Fun Challenges', icon: '🎮', color: '#ec4899' },
    { title: 'Leaderboard', icon: '🏆', color: '#f97316' },
    { title: 'Profile', icon: '👤', color: '#06b6d4' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 0',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {navItems.map((section, index) => (
            <motion.button
              key={section.title}
              whileHover={{ scale: 1.05, boxShadow: `0 4px 15px ${section.color}40` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(index)}
              style={{
                padding: '12px 24px',
                borderRadius: '15px',
                border: 'none',
                background: activeSection === index 
                  ? `linear-gradient(135deg, ${section.color}, ${section.color}90)` 
                  : 'rgba(255, 255, 255, 0.05)',
                color: activeSection === index ? 'white' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
              <span>{section.title}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{
        minHeight: 'calc(100vh - 100px)',
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              minHeight: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {activeSection === 0 && (
              <div style={{ width: '100%' }}>
                <h2>Daily Tasks</h2>
                {/* Your existing daily tasks content */}
              </div>
            )}
            
            {activeSection === 1 && (
              <div style={{ width: '100%', maxWidth: '1200px' }}>
                <CalorieDashboard />
              </div>
            )}
            
            {activeSection === 2 && (
              <div style={{ width: '100%', padding: '20px' }}>
                <LevelRoadmap />
              </div>
            )}
            
            {activeSection === 3 && (
              <div style={{ width: '100%', height: 'calc(100vh - 180px)' }}>
                <AIAssistant />
              </div>
            )}
            
            {activeSection === 4 && (
              <div style={{ width: '100%' }}>
                <h2>Fun Challenges</h2>
                <p>Exciting challenges coming soon!</p>
              </div>
            )}
            
            {activeSection === 5 && (
              <div style={{ width: '100%' }}>
                <Leaderboard />
              </div>
            )}
            
            {activeSection === 6 && (
              <div style={{ width: '100%' }}>
                <Profile user={{}} setUser={() => {}} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DashboardWithCalorieTracker;
