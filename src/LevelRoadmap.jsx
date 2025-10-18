import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaStar, FaCrown, FaFire, FaBolt, FaGem, FaInfoCircle, FaLock, FaCheck, FaMedal } from 'react-icons/fa';
import { getUserProfile, updateUserProfile } from './firebase'; // Assuming you have this file
import axios from 'axios'; // For backend API calls

// Enhanced level data with rewards and descriptions
const LEVELS = [
  { id: 1, name: "Sprout", xpRequired: 250, icon: "🌱", color: "#10b981", description: "Your journey begins! Take your first steps toward growth.", reward: "Basic Profile Badge" },
  { id: 2, name: "Seedling", xpRequired: 500, icon: "🌿", color: "#3b82f6", description: "Growing stronger each day. Keep up the momentum!", reward: "Daily Streak Multiplier" },
  { id: 3, name: "Bloom", xpRequired: 750, icon: "🌸", color: "#8b5cf6", description: "Your efforts are starting to show beautiful results.", reward: "Custom Theme Access" },
  { id: 4, name: "Growth", xpRequired: 1000, icon: "🌳", color: "#ec4899", description: "Steady progress and consistent effort lead to substantial growth.", reward: "Bonus XP Tasks" },
  { id: 5, name: "Flourish", xpRequired: 1250, icon: "🌺", color: "#f59e0b", description: "You're flourishing! Your habits are becoming second nature.", reward: "Achievement Showcase" },
  { id: 6, name: "Thrive", xpRequired: 1500, icon: "🌴", color: "#ef4444", description: "Thriving in your journey, inspiring others around you.", reward: "Weekly Challenge Access" },
  { id: 7, name: "Excel", xpRequired: 1750, icon: "⭐", color: "#dc2626", description: "Excellence is not an act but a habit you've mastered.", reward: "Profile Animations" },
  { id: 8, name: "Master", xpRequired: 2000, icon: "👑", color: "#7c3aed", description: "You've mastered the fundamentals and are ready for greater challenges.", reward: "Exclusive Avatar Frame" },
  { id: 9, name: "Sage", xpRequired: 2250, icon: "🧙", color: "#db2777", description: "Your wisdom and experience guide not only you but others.", reward: "Mentor Badge" },
  { id: 10, name: "Legend", xpRequired: 2500, icon: "🏆", color: "#06b6d4", description: "Your dedication has made you legendary among peers.", reward: "Custom Dashboard Layout" },
  { id: 11, name: "Champion", xpRequired: 2750, icon: "⚡", color: "#fbbf24", description: "A champion of personal growth, unstoppable and inspiring.", reward: "Double XP Weekends" },
  { id: 12, name: "Hero", xpRequired: 3000, icon: "🦸", color: "#a855f7", description: "Your heroic journey inspires everyone around you.", reward: "Special Event Access" },
  { id: 13, name: "Titan", xpRequired: 3250, icon: "💪", color: "#f97316", description: "Titan of discipline and consistency, a force to be reckoned with.", reward: "Leaderboard Spotlight" },
  { id: 14, name: "Oracle", xpRequired: 3500, icon: "🔮", color: "#0ea5e9", description: "Your insights and foresight guide your perfect decisions.", reward: "Predictive Analytics" },
  { id: 15, name: "Divine", xpRequired: 3750, icon: "✨", color: "#fcd34d", description: "You've reached the pinnacle of personal excellence.", reward: "Legacy Achievement" },
];

function LevelRoadmap({ user }) {
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Refs for animations
  const confettiRef = useRef(null);
  const roadmapRef = useRef(null);

  useEffect(() => {
    if (user?.uid) {
      fetchUserProgress();
      fetchUserAchievements();
    } else {
      // No user logged in, set default state
      setLoading(false);
    }
  }, [user]);

  // Fetch user achievements from backend
  const fetchUserAchievements = async () => {
    if (!user?.uid) return;
    
    try {
      // Try to fetch from backend first
      const response = await axios.get(`http://localhost:5000/api/achievements/${user.uid}`);
      if (response.data && response.data.achievements) {
        setAchievements(response.data.achievements);
        return;
      }
    } catch (error) {
      console.log('Using mock achievements data (backend may not be available)');
      // Fallback to mock data if backend is not available
      setAchievements([
        { id: 'first_login', name: 'First Steps', description: 'Logged in for the first time', date: new Date().toISOString() },
        { id: 'level_5', name: 'Growing Strong', description: 'Reached level 5', date: new Date().toISOString() }
      ]);
    }
  };

  const fetchUserProgress = async () => {
    try {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(user.uid);

      if (profile) {
        setUserProfile(profile);
        setUserLevel(profile.level || 1);
        setUserXP(profile.xp || 0);
      } else {
        // Create default profile if none exists
        const defaultProfile = {
          level: 1,
          xp: 0,
          totalPoints: 0,
          streak: 0,
          tasksCompleted: 0,
          skillsUnlocked: 0,
          mindfulMinutes: 0,
          badges: []
        };
        setUserProfile(defaultProfile);
        setUserLevel(1);
        setUserXP(0);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Set default values on error
      setUserLevel(1);
      setUserXP(0);
      setUserProfile({
        level: 1,
        xp: 0,
        totalPoints: 0,
        streak: 0,
        tasksCompleted: 0,
        skillsUnlocked: 0,
        mindfulMinutes: 0,
        badges: []
      });
    } finally {
      setLoading(false);
    }
  };

  const addXP = async (amount) => {
    if (!user?.uid) return;

    try {
      const newXP = (userProfile?.xp || 0) + amount;
      const newLevel = Math.floor(newXP / 250) + 1;
      const oldLevel = userLevel;

      // Update local state first for immediate feedback
      setUserXP(newXP);
      if (newLevel > oldLevel) {
        setUserLevel(newLevel);
        setShowLevelUp(true);
        setShowConfetti(true);
        
        // Try to update achievement on backend
        try {
          await axios.post(`http://localhost:5000/api/achievements/${user.uid}`, {
            achievement: {
              id: `level_${newLevel}`,
              name: `Reached Level ${newLevel}`,
              description: `Achieved ${LEVELS[newLevel-1].name} status`,
              date: new Date().toISOString()
            }
          });
        } catch (error) {
          console.log('Could not save achievement to backend');
        }
        
        setTimeout(() => {
          setShowLevelUp(false);
          setShowConfetti(false);
        }, 5000);
      }

      // Update Firebase
      await updateUserProfile(user.uid, {
        xp: newXP,
        level: newLevel,
        totalPoints: (userProfile?.totalPoints || 0) + amount
      });

      // Update local profile
      setUserProfile(prev => ({
        ...prev,
        xp: newXP,
        level: newLevel,
        totalPoints: (prev?.totalPoints || 0) + amount
      }));

    } catch (error) {
      console.error('Error adding XP:', error);
      // Still update local state for better UX even if Firebase fails
      const newXP = (userProfile?.xp || 0) + amount;
      const newLevel = Math.floor(newXP / 250) + 1;
      setUserXP(newXP);
      setUserLevel(newLevel);
    }
  };

  const getCurrentLevelInfo = () => {
    return LEVELS.find(l => l.id === userLevel) || LEVELS[0];
  };

  const getNextLevelInfo = () => {
    return LEVELS.find(l => l.id === userLevel + 1) || LEVELS[LEVELS.length - 1];
  };

  const getProgressPercentage = () => {
    const currentLevelInfo = getCurrentLevelInfo();
    const nextLevelInfo = getNextLevelInfo();

    if (userLevel >= LEVELS.length) {
        return 100;
    }

    // Fix bug in progress calculation
    const currentLevelStartXP = (currentLevelInfo.id - 1) * 250;
    const xpInCurrentLevel = userXP - currentLevelStartXP;
    
    // Always use 250 as the XP difference between levels
    const xpNeededForLevel = 250;

    return Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
  };


   // Function to handle level node click
  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setShowLevelDetails(true);
  };

  // Function to close level details modal
  const closeLevelDetails = () => {
    setShowLevelDetails(false);
  };

  // Confetti effect component
  const Confetti = () => {
    useEffect(() => {
      if (!showConfetti || !confettiRef.current) return;
      
      const canvas = confettiRef.current;
      const ctx = canvas.getContext('2d');
      const particles = [];
      const particleCount = 150;
      
      // Set canvas size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 10 + 5,
          color: LEVELS[Math.floor(Math.random() * LEVELS.length)].color,
          speed: Math.random() * 5 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
        });
      }
      
      // Animation loop
      let animationId;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
          
          p.y += p.speed;
          p.rotation += p.rotationSpeed;
          
          // Reset particles that fall out of view
          if (p.y > canvas.height) {
            p.y = -p.size;
            p.x = Math.random() * canvas.width;
          }
        });
        
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      // Cleanup
      return () => {
        cancelAnimationFrame(animationId);
      };
    }, [showConfetti]);
    
    return (
      <canvas 
        ref={confettiRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      />
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your growth journey...</p>
      </div>
    );
  }

  const currentLevel = getCurrentLevelInfo();
  const nextLevel = getNextLevelInfo();
  const progressPercent = getProgressPercentage();

  return (
    <div style={styles.container}>
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}
      
      {/* Level Details Modal */}
      <AnimatePresence>
        {showLevelDetails && selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalBackdrop}
            onClick={closeLevelDetails}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={{
                ...styles.modalContent,
                borderColor: selectedLevel.color,
                background: `linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <div style={{
                  ...styles.modalIconContainer,
                  background: `linear-gradient(135deg, ${selectedLevel.color}33, ${selectedLevel.color}66)`,
                  boxShadow: `0 0 20px ${selectedLevel.color}66`
                }}>
                  <span style={styles.modalIcon}>{selectedLevel.icon}</span>
                </div>
                <h2 style={styles.modalTitle}>Level {selectedLevel.id}: {selectedLevel.name}</h2>
                <p style={styles.modalXP}>{selectedLevel.xpRequired} XP required</p>
              </div>
              
              <div style={styles.modalBody}>
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>Description</h3>
                  <p style={styles.modalDescription}>{selectedLevel.description}</p>
                </div>
                
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>Reward</h3>
                  <div style={styles.rewardBadge}>
                    <FaMedal color={selectedLevel.color} size={24} style={{ marginRight: '10px' }} />
                    <span>{selectedLevel.reward}</span>
                  </div>
                </div>
                
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>Status</h3>
                  <div style={styles.statusBadge}>
                    {userLevel >= selectedLevel.id ? (
                      <>
                        <FaCheck color="#10b981" size={18} style={{ marginRight: '10px' }} />
                        <span>Unlocked</span>
                      </>
                    ) : (
                      <>
                        <FaLock color="#9ca3af" size={18} style={{ marginRight: '10px' }} />
                        <span>Locked - Need {selectedLevel.xpRequired - userXP} more XP</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.modalCloseButton}
                onClick={closeLevelDetails}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            style={styles.levelUpNotification}
          >
            <FaCrown size={50} color="#fbbf24" />
            <h2>LEVEL UP!</h2>
            <p>You've reached {currentLevel.name}!</p>
            <div style={styles.rewardUnlocked}>
              <FaMedal color="#fbbf24" size={24} style={{ marginRight: '10px' }} />
              <span>Reward Unlocked: {currentLevel.reward}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={styles.title}>
          <FaTrophy color="#fbbf24" /> Your Growth Journey
        </h1>
        <p style={styles.subtitle}>Progress through 15 legendary levels</p>
      </motion.div>

      {/* Current Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          ...styles.currentLevelCard,
          background: `linear-gradient(135deg, ${currentLevel.color}22, ${currentLevel.color}44)`,
          borderColor: currentLevel.color,
        }}
        onClick={() => handleLevelClick(currentLevel)}
      >
        <div style={styles.levelIcon}>{currentLevel.icon}</div>
        <div style={styles.levelInfo}>
          <h2 style={styles.levelName}>
            Level {currentLevel.id}: {currentLevel.name}
          </h2>
          <p style={styles.xpText}>
            {userXP} / {nextLevel.xpRequired} XP
          </p>
          <p style={styles.levelDescription}>{currentLevel.description}</p>
        </div>
        <div style={styles.levelBadge}>
          <FaStar color={currentLevel.color} size={24} />
          <FaInfoCircle 
            color="#fff" 
            size={16} 
            style={{ marginTop: '10px', cursor: 'pointer' }} 
          />
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabels}>
          <span style={styles.progressLabel}>
            {currentLevel.name}
          </span>
          <span style={styles.progressLabel}>
            {progressPercent.toFixed(0)}%
          </span>
          <span style={styles.progressLabel}>
            {nextLevel.name}
          </span>
        </div>
        <div style={styles.progressBarBg}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              ...styles.progressBarFill,
              background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
            }}
          />
        </div>
      </div>

      {/* XP Actions */}
      <div style={styles.xpActions}>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${currentLevel.color}` }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addXP(50)}
          style={{
            ...styles.xpButton,
            background: `linear-gradient(135deg, ${currentLevel.color}, ${nextLevel.color})`,
          }}
        >
          <FaFire /> +50 XP
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${currentLevel.color}` }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addXP(100)}
          style={{
            ...styles.xpButton,
            background: `linear-gradient(135deg, ${currentLevel.color}, ${nextLevel.color})`,
          }}
        >
          <FaBolt /> +100 XP
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${currentLevel.color}` }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addXP(250)}
          style={{
            ...styles.xpButton,
            background: `linear-gradient(135deg, ${currentLevel.color}, ${nextLevel.color})`,
          }}
        >
          <FaGem /> +250 XP
        </motion.button>
      </div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={styles.achievementsContainer}
      >
        <h3 style={styles.achievementsTitle}>Recent Achievements</h3>
        <div style={styles.achievementsList}>
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={styles.achievementItem}
                whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.1)' }}
              >
                <FaMedal color="#fbbf24" size={18} style={{ marginRight: '10px' }} />
                <div style={styles.achievementInfo}>
                  <p style={styles.achievementName}>{achievement.name}</p>
                  <p style={styles.achievementDescription}>{achievement.description}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p style={styles.noAchievements}>Complete tasks to earn achievements!</p>
          )}
        </div>
      </motion.div>

      {/* Roadmap Path */}
      <div style={styles.roadmapContainer} ref={roadmapRef}>
        <h3 style={styles.roadmapTitle}>Level Roadmap</h3>
        <div style={styles.roadmapPath}>
          {LEVELS.map((level, index) => {
            const isUnlocked = userLevel >= level.id;
            const isCurrent = userLevel === level.id;
            const isNext = userLevel + 1 === level.id;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  ...styles.levelNode,
                  ...(isCurrent && styles.levelNodeCurrent),
                  ...(isNext && styles.levelNodeNext),
                  ...(!isUnlocked && styles.levelNodeLocked),
                }}
              >
                {/* Connector Line */}
                {index < LEVELS.length - 1 && (
                  <div
                    style={{
                      ...styles.connector,
                      background: isUnlocked
                        ? `linear-gradient(90deg, ${level.color}, ${LEVELS[index + 1].color})`
                        : '#333',
                    }}
                  />
                )}

                {/* Level Circle */}
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.1, boxShadow: `0 0 20px ${level.color}` } : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick(level)}
                  style={{
                    ...styles.levelCircle,
                    borderColor: isUnlocked ? level.color : '#555',
                    background: isUnlocked
                      ? `linear-gradient(135deg, ${level.color}33, ${level.color}66)`
                      : '#1a1a1a',
                    boxShadow: isCurrent
                      ? `0 0 30px ${level.color}`
                      : isUnlocked
                      ? `0 0 15px ${level.color}66`
                      : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={styles.levelEmoji}>{level.icon}</span>
                  {isCurrent && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={styles.currentIndicator}
                    />
                  )}
                </motion.div>

                {/* Level Info */}
                <div style={styles.levelNodeInfo}>
                  <p style={styles.levelNodeName}>{level.name}</p>
                  <p style={styles.levelNodeXP}>{level.xpRequired} XP</p>
                  {isUnlocked && (
                    <FaStar color={level.color} size={12} style={styles.unlockedStar} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    padding: '40px 20px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    color: '#fff',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.1)',
    borderTop: '4px solid #8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  levelUpNotification: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    padding: '40px 60px',
    borderRadius: '20px',
    textAlign: 'center',
    zIndex: 1000,
    boxShadow: '0 20px 60px rgba(251, 191, 36, 0.5)',
  },
  rewardUnlocked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
    padding: '10px 20px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    fontWeight: '600',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '900',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#9ca3af',
  },
  currentLevelCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '30px',
    borderRadius: '20px',
    border: '2px solid',
    marginBottom: '30px',
    backdropFilter: 'blur(10px)',
    maxWidth: '800px',
    margin: '0 auto 30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  levelIcon: {
    fontSize: '4rem',
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '10px',
  },
  xpText: {
    fontSize: '1.2rem',
    color: '#d1d5db',
    marginBottom: '10px',
  },
  levelDescription: {
    fontSize: '0.9rem',
    color: '#d1d5db',
    fontStyle: 'italic',
  },
  levelBadge: {
    background: 'rgba(0,0,0,0.3)',
    padding: '15px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progressContainer: {
    maxWidth: '800px',
    margin: '0 auto 40px',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    fontWeight: '600',
  },
  progressBarBg: {
    width: '100%',
    height: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 1s ease-out',
  },
  xpActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '50px',
    flexWrap: 'wrap',
  },
  xpButton: {
    padding: '15px 30px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
    transition: 'all 0.3s ease',
  },
  achievementsContainer: {
    maxWidth: '800px',
    margin: '0 auto 50px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '20px',
    padding: '30px',
  },
  achievementsTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '20px',
    textAlign: 'center',
  },
  achievementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  achievementItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '5px',
  },
  achievementDescription: {
    fontSize: '0.8rem',
    color: '#d1d5db',
  },
  noAchievements: {
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    padding: '20px',
  },
  roadmapContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  roadmapTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '40px',
  },
  roadmapPath: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    position: 'relative',
  },
  levelNode: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '120px',
  },
  levelNodeCurrent: {
    transform: 'scale(1.1)',
  },
  levelNodeNext: {
    opacity: 0.9,
  },
  levelNodeLocked: {
    opacity: 0.4,
  },
  connector: {
    position: 'absolute',
    top: '40px',
    left: '100%',
    width: '20px',
    height: '4px',
    zIndex: 0,
  },
  levelCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.3s ease',
  },
  levelEmoji: {
    fontSize: '2.5rem',
  },
  currentIndicator: {
    position: 'absolute',
    inset: '-10px',
    border: '3px solid #fbbf24',
    borderRadius: '50%',
    borderTop: '3px solid transparent',
  },
  levelNodeInfo: {
    textAlign: 'center',
    marginTop: '10px',
  },
  levelNodeName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    marginBottom: '5px',
  },
  levelNodeXP: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  unlockedStar: {
    marginTop: '5px',
  },
  // Modal styles
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    width: '90%',
    maxWidth: '600px',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    borderRadius: '20px',
    padding: '30px',
    border: '2px solid',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    textAlign: 'center',
  },
  modalIconContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  modalIcon: {
    fontSize: '4rem',
  },
  modalTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '10px',
  },
  modalXP: {
    fontSize: '1.2rem',
    color: '#d1d5db',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  modalSection: {
    marginBottom: '20px',
  },
  modalSectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '15px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '10px',
  },
  modalDescription: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#d1d5db',
  },
  rewardBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    fontWeight: '600',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: '12px 30px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '30px',
    width: '100%',
  },
};

export default LevelRoadmap;