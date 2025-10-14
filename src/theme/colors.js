// Unified theme configuration for the entire app
export const THEME = {
  // Background gradients
  backgrounds: {
    primary: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    secondary: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    forest: 'linear-gradient(135deg, #134e4a 0%, #14532d 50%, #1e3a8a 100%)',
  },

  // Primary colors
  colors: {
    primary: {
      blue: '#3B82F6',
      purple: '#8B5CF6',
      cyan: '#06B6D4',
      green: '#10B981',
      orange: '#F59E0B',
      pink: '#EC4899',
      indigo: '#6366F1',
      yellow: '#FBBF24',
      red: '#EF4444',
    },
    
    // Text colors
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      muted: '#64748B',
      white: '#FFFFFF',
    },

    // Background overlays
    overlay: {
      dark: 'rgba(0, 0, 0, 0.6)',
      light: 'rgba(255, 255, 255, 0.1)',
      glass: 'rgba(255, 255, 255, 0.08)',
    },
  },

  // Gradient combinations
  gradients: {
    primary: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%)',
    secondary: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    gold: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    rainbow: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%)',
  },

  // Card styles
  cards: {
    glass: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(25px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '25px',
    },
    solid: {
      background: 'rgba(17, 24, 39, 0.95)',
      borderRadius: '20px',
      border: '2px solid rgba(75, 85, 99, 0.3)',
    },
  },

  // Shadows
  shadows: {
    sm: '0 4px 16px rgba(0, 0, 0, 0.3)',
    md: '0 8px 32px rgba(0, 0, 0, 0.4)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.6)',
    glow: {
      purple: '0 0 40px rgba(168, 85, 247, 0.6)',
      blue: '0 0 40px rgba(59, 130, 246, 0.6)',
      green: '0 0 40px rgba(16, 185, 129, 0.6)',
      orange: '0 0 40px rgba(245, 158, 11, 0.6)',
    },
  },

  // Typography
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Border radius
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '25px',
    full: '9999px',
  },

  // Animations
  animations: {
    transition: {
      fast: '0.2s ease',
      normal: '0.3s ease',
      slow: '0.5s ease',
    },
  },
};

export default THEME;
