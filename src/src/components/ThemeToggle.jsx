import { motion } from 'framer-motion';
import { useTheme } from '../../ThemeContext';

const ThemeToggle = () => {
  const { currentTheme, changeTheme, theme: themeColors } = useTheme();
  const isDark = currentTheme === 'dark';
  
  const toggleTheme = () => {
    changeTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        background: isDark 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#fff',
        fontSize: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isDark
          ? '0 8px 32px rgba(102, 126, 234, 0.4)'
          : '0 8px 32px rgba(245, 87, 108, 0.4)',
        transition: 'all 0.3s ease',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
