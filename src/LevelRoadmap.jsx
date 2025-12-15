/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaStar, FaCrown, FaFire, FaBolt, FaGem, FaInfoCircle, FaLock, FaCheck, FaMedal } from 'react-icons/fa';
import axios from 'axios'; 
// useTheme removed - styles are controlled locally

// Level data (no changes)
const LEVELS = [
  { id: 1, name: "Sprout", xpRequired: 0, icon: "🌱", color: "#10b981", description: "Your journey begins! Take your first steps toward growth.", reward: "Basic Profile Badge" },
  { id: 2, name: "Seedling", xpRequired: 250, icon: "🌿", color: "#3b82f6", description: "Growing stronger each day. Keep up the momentum!", reward: "Daily Streak Multiplier" },
  { id: 3, name: "Bloom", xpRequired: 500, icon: "🌸", color: "#8b5cf6", description: "Your efforts are starting to show beautiful results.", reward: "Custom Theme Access" },
  { id: 4, name: "Growth", xpRequired: 1000, icon: "🌳", color: "#ec4899", description: "Steady progress and consistent effort lead to substantial growth.", reward: "Bonus XP Tasks" },
  { id: 5, name: "Flourish", xpRequired: 1500, icon: "🌺", color: "#f59e0b", description: "You're flourishing! Your habits are becoming second nature.", reward: "Achievement Showcase" },
  { id: 6, name: "Thrive", xpRequired: 2000, icon: "🌴", color: "#ef4444", description: "Thriving in your journey, inspiring others around you.", reward: "Weekly Challenge Access" },
  { id: 7, name: "Excel", xpRequired: 2500, icon: "⭐", color: "#dc2626", description: "Excellence is not an act but a habit you've mastered.", reward: "Profile Animations" },
  { id: 8, name: "Master", xpRequired: 3000, icon: "👑", color: "#7c3aed", description: "You've mastered the fundamentals and are ready for greater challenges.", reward: "Exclusive Avatar Frame" },
  { id: 9, name: "Sage", xpRequired: 3500, icon: "🧙", color: "#db2777", description: "Your wisdom and experience guide not only you but others.", reward: "Mentor Badge" },
  { id: 10, name: "Legend", xpRequired: 4000, icon: "🏆", color: "#06b6d4", description: "Your dedication has made you legendary among peers.", reward: "Custom Dashboard Layout" },
  { id: 11, name: "Champion", xpRequired: 4500, icon: "⚡", color: "#fbbf24", description: "A champion of personal growth, unstoppable and inspiring.", reward: "Double XP Weekends" },
  { id: 12, name: "Hero", xpRequired: 5000, icon: "🦸", color: "#a855f7", description: "Your heroic journey inspires everyone around you.", reward: "Special Event Access" },
  { id: 13, name: "Titan", xpRequired: 5500, icon: "💪", color: "#f97316", description: "Titan of discipline and consistency, a force to be reckoned with.", reward: "Leaderboard Spotlight" },
  { id: 14, name: "Oracle", xpRequired: 6000, icon: "🔮", color: "#0ea5e9", description: "Your insights and foresight guide your perfect decisions.", reward: "Predictive Analytics" },
  { id: 15, name: "Divine", xpRequired: 6500, icon: "✨", color: "#fcd34d", description: "You've reached the pinnacle of personal excellence.", reward: "Legacy Achievement" },
];

function LevelRoadmap({ level, xp }) {
  // UseTheme is no longer the primary style driver
  // const { theme } = useTheme(); 
  // const currentTheme = theme || {};
  const containerStyle = {
    ...styles.container,
    // background: currentTheme.background || styles.container.background, // Overridden by styles.container
    // color: currentTheme.textPrimary || styles.container.color, // Overridden by styles.container
  };

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiRef = useRef(null);
  const roadmapRef = useRef(null);
  const prevLevelRef = useRef(level); 

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp(true);
      setShowConfetti(true);

      const timer = setTimeout(() => {
        setShowLevelUp(false);
        setShowConfetti(false);
      }, 5000); 
      
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = level;
  }, [level]); 

  useEffect(() => {
    fetchUserAchievements();
  }, []);

  const fetchUserAchievements = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/achievements/mock-user`);
      if (response.data && response.data.achievements) {
        setAchievements(response.data.achievements);
        return;
      }
		} catch (error) {
			console.log('Using mock achievements data (backend may not be available)', error);
      setAchievements([
        { id: 'first_login', name: 'First Steps', description: 'Logged in for the first time', date: new Date().toISOString() },
        { id: 'level_5', name: 'Growing Strong', description: 'Reached level 5', date: new Date().toISOString() }
      ]);
    }
  };

  const calculateLevel = (xp) => {
    if (xp === 0) return 1;
    let level = 2; 
    for (let i = 3; i <= LEVELS.length; i++) {
      if (xp >= LEVELS[i-1].xpRequired) {
        level = i;
      } else {
        break;
      }
    }
    return level;
  };

  const currentLevelId = calculateLevel(xp || 0);
  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.id === currentLevelId + 1) || LEVELS[LEVELS.length - 1];
  
  const progressPercent = (() => {
    if (currentLevelId >= LEVELS[LEVELS.length - 1].id) return 100;
    
    const currentXP = xp || 0;
    const currentLevelXP = currentLevel.xpRequired;
    const nextLevelXP = nextLevel.xpRequired;
    
    const xpInCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    return Math.min(Math.max((xpInCurrentLevel / xpNeededForNextLevel) * 100, 0), 100);
  })();

	// helper aliases
	// (explicit helper functions removed to avoid unused-var linter warnings)

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setShowLevelDetails(true);
  };

  const closeLevelDetails = () => {
    setShowLevelDetails(false);
  };

  // Confetti component (unchanged)
  const Confetti = () => {
    useEffect(() => {
      if (!showConfetti || !confettiRef.current) return;
      const canvas = confettiRef.current;
      const ctx = canvas.getContext('2d');
      const particles = [];
      const particleCount = 150;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
          if (p.y > canvas.height) {
            p.y = -p.size;
            p.x = Math.random() * canvas.width;
          }
        });
        animationId = requestAnimationFrame(animate);
      };
      animate();
      return () => {
        cancelAnimationFrame(animationId);
      };
	}, []);
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

  const currentLevelInfo = currentLevel;
  const nextLevelInfo = nextLevel;
  const currentProgress = progressPercent;

  return (
    <div style={containerStyle}>
      {showConfetti && <Confetti />}
      
      {/* Modal (unchanged - kept light theme for contrast) */}
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
                    {level >= selectedLevel.id ? (
                      <>
                        <FaCheck color="#10b981" size={18} style={{ marginRight: '10px' }} />
                        <span>Unlocked</span>
                      </>
                    ) : (
                      <>
                        <FaLock color="#9ca3af" size={18} style={{ marginRight: '10px' }} />
                        <span>Locked - Need {selectedLevel.xpRequired - xp} more XP</span>
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

      {/* Level Up Animation (unchanged) */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            style={styles.levelUpNotification} // This style is missing, added below
          >
            <FaCrown size={50} color="#fbbf24" />
            <h2>LEVEL UP!</h2>
            <p>🎉 Congratulations! You've reached Level {currentLevel.id}: {currentLevel.name}! Keep growing!</p>
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
				whileHover={{ scale: 1.02, boxShadow: '0 12px 45px rgba(139, 127, 199, 0.25)' }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          ...styles.currentLevelCard,
					// Bright white card background
					background: 'rgba(255, 255, 255, 0.98)', 
					// Soft purple border
					borderColor: 'rgba(139, 127, 199, 0.2)',
        }}
        onClick={() => handleLevelClick(currentLevelInfo)}
      >
        <div style={styles.levelIcon}>{currentLevelInfo.icon}</div>
        <div style={styles.levelInfo}>
          <h2 style={styles.levelName}>
            Level {currentLevelInfo.id}: {currentLevelInfo.name}
          </h2>
          <p style={styles.xpText}>
            {/* MODIFIED: Use `xp` prop directly */}
      	  {xp} / {nextLevelInfo.xpRequired} XP
          </p>
          <p style={styles.levelDescription}>{currentLevelInfo.description}</p>
        </div>
        <div style={styles.levelBadge}>
          <FaStar color="#FFD700" size={24} />
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
            {currentLevelInfo.name}
          </span>
          <span style={styles.progressLabel}>
            {currentProgress.toFixed(0)}%
          </span>
          <span style={styles.progressLabel}>
            {nextLevelInfo.name}
          </span>
        </div>
        <div style={styles.progressBarBg}>
          <motion.div
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              ...styles.progressBarFill,
              // MODIFIED: Hardcoded gradient to match image (purple-to-pink)
              background: `linear-gradient(90deg, #8b5cf6, #ec4899)`,
            }}
          />
        </div>
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
	whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.96)' }}
              >
                <FaMedal color="#fbbf24" size={18} style={{ marginRight: '10px' }} />
                <div style={styles.achievementInfo}>
                  <p style={styles.achievementName}>{achievement.name}</p>
                  <p style={styles.achievementDescription}>{achievement.description}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0 }}
              style={styles.achievementItem}
		  whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.96)' }}
            >
              <FaMedal color="#fbbf24" size={18} style={{ marginRight: '10px' }} />
              <div style={styles.achievementInfo}>
                <p style={styles.noAchievements}>Complete tasks to earn achievements!</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Roadmap Path */}
      <div style={styles.roadmapContainer} ref={roadmapRef}>
        <h3 style={styles.roadmapTitle}>Level Roadmap</h3>
        <motion.div style={styles.roadmapPath}>
          {LEVELS.map((levelNode, index) => {
            const isUnlocked = currentLevelId >= levelNode.id; // MODIFIED: Use currentLevelId
            const isCurrent = currentLevelId === levelNode.id; // MODIFIED: Use currentLevelId
            const isNext = currentLevelId + 1 === levelNode.id; // MODIFIED: Use currentLevelId

            return (
              <motion.div
                key={levelNode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                style={{
                  ...styles.levelNode,
                  ...(isCurrent && styles.levelNodeCurrent),
                  ...(isNext && styles.levelNodeNext),
                  ...(!isUnlocked && styles.levelNodeLocked),
                }}
              >
                {/* Connector Line */}
                {index < LEVELS.length - 1 && (
							<motion.div
								style={{
									...styles.connector,
									background: isUnlocked
										? `linear-gradient(90deg, ${levelNode.color}, ${LEVELS[index + 1].color})`
										: 'rgba(230,233,244,1)', // light connector when locked
								}}
							/>
                )}

                {/* Level Circle */}
							<motion.div
								whileHover={isUnlocked ? { scale: 1.1, boxShadow: `0 0 20px ${levelNode.color}` } : { scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								animate={isCurrent ? { 
									boxShadow: [
										`0 0 20px ${levelNode.color}66`, 
										`0 0 35px ${levelNode.color}aa`, 
										`0 0 20px ${levelNode.color}66`
									] 
								} : {}}
								transition={isCurrent ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
								onClick={() => handleLevelClick(levelNode)}
								style={{
									...styles.levelCircle,
									borderColor: isUnlocked ? levelNode.color : '#c7c9d8',
									background: isUnlocked
										? `linear-gradient(135deg, ${levelNode.color}33, ${levelNode.color}66)`
										: 'rgba(245,246,250,1)', // light locked background
									boxShadow: isUnlocked && !isCurrent
										? `0 0 15px ${levelNode.color}66`
										: 'none',
									cursor: 'pointer',
								}}
							>
                  <span style={styles.levelEmoji}>{levelNode.icon}</span>
                  {isCurrent && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
					 ease: "linear"
                      }}
                      style={styles.currentIndicator}
                    />
                  )}
                </motion.div>

                {/* Level Info */}
                <motion.div
                  style={styles.levelNodeInfo}
                >
                  <p style={styles.levelNodeName}>{levelNode.name}</p>
                  <p style={styles.levelNodeXP}>{levelNode.xpRequired} XP</p>
									{isUnlocked && (
										<motion.div>
											<FaStar color={levelNode.color} size={12} style={styles.unlockedStar} />
										</motion.div>
									)}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// Styles - MODIFIED for Dark/Glassmorphic Theme
const styles = {
	container: {
		minHeight: '100vh',
		// Bright white / pastel background
		background: 'linear-gradient(135deg, #ffffff 0%, #fbfbff 100%)',
		padding: '48px 32px',
		fontFamily: "'Inter', 'Segoe UI', sans-serif",
		// Dark text for readability on white background
		color: '#2D3748',
		position: 'relative',
		overflow: 'hidden',
	},
	loadingContainer: {
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
		color: '#2D3748',
	},
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(232, 232, 232, 1)',
    borderTop: '4px solid #ffffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  // ADDED: Style for the level up notification
  levelUpNotification: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
	background: 'linear-gradient(135deg, #f7f7f7ff, #e9e9e9ff)',
    padding: '40px 60px',
    borderRadius: '24px',
    textAlign: 'center',
    zIndex: 1001, // Above confetti
    boxShadow: '0 20px 60px rgba(221, 207, 207, 0.95)',
    border: '1px solid rgba(235, 228, 228, 0.1)',
    color: '#FFFFFF',
  },
  rewardUnlocked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
    padding: '10px 20px',
    background: 'rgba(251, 191, 36, 0.2)',
    borderRadius: '10px',
    fontWeight: '600',
    color: '#fbbf24',
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
    // MODIFIED: Explicitly set white
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: '1.2rem',
    // MODIFIED: Light lavender color
    color: '#B0A8D9',
    fontWeight: '500',
  },
	currentLevelCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '32px',
    borderRadius: '24px',
    // MODIFIED: Border thickness
    border: '1px solid',
    marginBottom: '32px',
    maxWidth: '900px',
    margin: '0 auto 32px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
		// Soft purple shadow on white
		boxShadow: '0 12px 40px rgba(139, 127, 199, 0.15)',
    // Background and border are set inline
  },
  levelIcon: {
    fontSize: '4.5rem',
  },
  levelInfo: {
    flex: 1,
  },
	levelName: {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '12px',
		color: '#2D3748',
  },
  xpText: {
    fontSize: '1.3rem',
		color: '#718096',
    marginBottom: '12px',
    fontWeight: '600',
  },
  levelDescription: {
    fontSize: '1rem',
		color: '#4A5568',
    fontStyle: 'italic',
	lineHeight: '1.6',
  },
  levelBadge: {
    // MODIFIED: Darker background to match image
    background: 'rgba(255, 255, 255, 0.5)',
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
		color: '#718096',
		fontWeight: '600',
	},
	progressBarBg: {
		width: '100%',
		height: '20px',
		background: 'rgba(232, 213, 242, 0.25)',
		border: '1px solid rgba(139, 127, 199, 0.2)',
		borderRadius: '10px',
		overflow: 'hidden',
	},
  progressBarFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 1s ease-out',
    // Background is set inline
	},
  // ... (xpActions and xpButton removed as they are commented out in JSX)
	achievementsContainer: {
		maxWidth: '800px',
		margin: '0 auto 50px',
		background: 'rgba(255, 255, 255, 0.98)',
		borderRadius: '24px',
		padding: '32px',
		border: '2px solid rgba(139, 127, 199, 0.15)',
		boxShadow: '0 12px 40px rgba(139, 127, 199, 0.08)',
	},
	achievementsTitle: {
		fontSize: '1.8rem',
		fontWeight: '700',
		marginBottom: '24px',
		textAlign: 'center',
		color: '#2D3748',
	},
  achievementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
	achievementItem: {
		display: 'flex',
		alignItems: 'center',
		padding: '18px',
		borderRadius: '16px',
		background: 'rgba(255,255,255,1)',
		border: '1px solid rgba(226,232,240,0.7)',
		transition: 'all 0.3s ease',
		cursor: 'pointer',
	},
  achievementInfo: {
    flex: 1,
  },
	achievementName: {
		fontSize: '1.1rem',
		fontWeight: '600',
		marginBottom: '6px',
		color: '#2D3748',
	},
	achievementDescription: {
		fontSize: '0.9rem',
		color: '#718096',
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
		color: '#2D3748',
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
    // MODIFIED: White text
    color: '#FFFFFF',
  },
  levelNodeXP: {
    fontSize: '0.75rem',
    // MODIFIED: Light lavender text
    color: '#B0A8D9',
  },
  unlockedStar: {
    marginTop: '5px',
  },
  // Modal styles (Unchanged - kept light for contrast)
	modalBackdrop: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: 'rgba(255, 255, 255, 0.6)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1000,
		backdropFilter: 'blur(8px)',
	},
  modalContent: {
    width: '90%',
    maxWidth: '600px',
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '24px',
	padding: '36px',
    border: '2px solid',
    boxShadow: '0 20px 60px rgba(139, 127, 199, 0.3)',
    maxHeight: '80vh',
	overflow: 'auto',
    color: '#2D3748', // MODIFIED: Set base text color for modal
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
    color: '#2D3748',
  },
  modalXP: {
    fontSize: '1.2rem',
    color: '#718096',
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
    borderBottom: '2px solid rgba(139, 127, 199, 0.2)',
    paddingBottom: '10px',
    color: '#2D3748',
  },
	modalDescription: {
    fontSize: '1rem',
    lineHeight: '1.7',
  	 color: '#4A5568',
	},
  rewardBadge: {
  	 display: 'flex',
  	 alignItems: 'center',
  	 padding: '18px',
  	 borderRadius: '16px',
  	 background: 'rgba(232, 213, 242, 0.2)',
  	 border: '1px solid rgba(139, 127, 199, 0.2)',
  	 fontWeight: '600',
	color: '#2D3748',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '18px',
  	 borderRadius: '16px',
  	 background: 'rgba(212, 241, 244, 0.2)',
  	 border: '1px solid rgba(139, 127, 199, 0.2)',
  	 color: '#2D3748',
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