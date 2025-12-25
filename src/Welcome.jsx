import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { FaRocket } from 'react-icons/fa';

// This is the SVG for the animated bars graphic
const AnimatedBars = () => (
  <motion.svg
    width="480"
    height="380"
    viewBox="0 0 480 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', bottom: 0, right: 0 }}
  >
    <path d="M0 380 H 480" stroke="#C4B5FD" strokeWidth="4" />
    <motion.rect
      x="100"
      width="100"
      height="180"
      rx="15"
      fill="#C4B5FD"
      initial={{ height: 0, y: 380 }}
      animate={{ height: 180, y: 200 }}
      transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
    />
    <motion.rect
      x="220"
      width="100"
      height="260"
      rx="15"
      fill="#A78BFA"
      initial={{ height: 0, y: 380 }}
      animate={{ height: 260, y: 120 }}
      transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
    />
    <motion.rect
      x="340"
      width="100"
      height="100"
      rx="15"
      fill="#818CF8"
      initial={{ height: 0, y: 380 }}
      animate={{ height: 100, y: 280 }}
      transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
    />
  </motion.svg>
);


export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.floatingOrb1} />
      <div style={styles.floatingOrb2} />

      <motion.div 
        style={{...styles.decoBlock, top: '20%', right: '15%'}}
        initial={{ scale: 0, rotate: 45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      />
      <motion.div 
        style={{...styles.decoCircle, top: '30%', right: '30%'}}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      />

      {/* ======================================================== */}
      {/* === NAVIGATION BAR (ONLY LOGIN BUTTON) === */}
      {/* ======================================================== */}
      <motion.nav
        style={styles.navbar}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={styles.logoRocketIconContainer}>
          <FaRocket size={32} color="#4F46E5" />
        </div>
        
        <div style={styles.navLinks}>          
          {/* "Login" button box */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            style={styles.navButton}
          >
            Login
          </motion.button>
        </div>
      </motion.nav>
      {/* ======================================================== */}
      {/* === END NAVIGATION BAR === */}
      {/* ======================================================== */}


      {/* Main Content Area */}
      <div style={styles.contentWrapper}>
        {/* Left Content */}
        <motion.div
          style={styles.leftContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 style={styles.mainTitle}>
            Daily Growth Tracker
          </h1>
          <p style={styles.tagline}>
            Your growth is in your hands
          </p>
          <p style={styles.description}>
            Your intelligent companion for personal development.
            Track progress, build streaks, earn rewards, and achieve your goals
            one day at a time with ease and motivation.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            style={styles.ctaButton}
          >
            Get Started
            <FiArrowRight style={{ marginLeft: '8px' }} />
          </motion.button>
        </motion.div>
        
        {/* Right Content (Illustration) */}
        <motion.div 
          style={styles.rightContent}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <AnimatedBars />
        </motion.div>
      </div>
    </div>
  );
}

// =================================================================
// === STYLES OBJECT ===
// =================================================================
const styles = {
  container: {
    background: 'linear-gradient(135deg, #f0e6ff 0%, #e0d9ff 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    color: '#1e0a40',
  },
  floatingOrb1: {
    position: 'absolute',
    top: '-100px',
    right: '-100px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, rgba(138, 43, 226, 0) 70%)',
    zIndex: 0,
  },
  floatingOrb2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-100px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, rgba(168, 85, 247, 0) 70%)',
    zIndex: 0,
  },
  decoBlock: {
    position: 'absolute',
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: '#A78BFA',
    opacity: 0.5,
    zIndex: 1,
  },
  decoCircle: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#C4B5FD',
    opacity: 0.5,
    zIndex: 1,
  },
  logoRocketIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbar: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    boxSizing: 'border-box',
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navButton: {
    textDecoration: 'none',
    color: '#4F46E5',
    border: '2px solid #C4B5FD',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  contentWrapper: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '0 40px',
    boxSizing: 'border-box',
    zIndex: 5,
  },
  leftContent: {
    maxWidth: '500px',
  },
  rightContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: '400px',
  },
  mainTitle: {
    fontSize: '3.8rem',
    fontWeight: '800',
    color: '#1e0a40',
    marginBottom: '20px',
    lineHeight: '1.2',
    letterSpacing: '-1px',
  },
  tagline: {
    fontFamily: 'serif',
    fontSize: '1.5rem',
    color: '#4f46e5',
    fontWeight: '500',
    margin: 0,
    marginBottom: '24px',
  },
  description: {
    fontSize: '1.1rem',
    color: '#6B7280',
    marginBottom: '40px',
    lineHeight: '1.7',
    fontWeight: '400',
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
    transition: 'all 0.3s ease',
  },
};