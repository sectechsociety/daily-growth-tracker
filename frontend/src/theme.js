// Centralized theme constants for unified bright design
export const theme = {
  background: '#ffffff',
  cardBg: '#ffffff',
  accent: '#8B7FC7',
  accentHover: '#7a6db5',
  borderColor: 'rgba(254, 254, 255, 0.2)',
  shadow: '0 12px 40px rgba(236, 234, 246, 0.15)',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  danger: '#ef4444',
  success: '#10b981'
};

export const cardStyle = {
  background: theme.cardBg,
  border: `2px solid ${theme.borderColor}`,
  borderRadius: '24px',
  boxShadow: theme.shadow
};