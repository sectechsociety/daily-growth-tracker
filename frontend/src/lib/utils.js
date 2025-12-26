import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format XP with K/M/B suffixes
export function formatXP(xp) {
  if (xp >= 1000000000) {
    return (xp / 1000000000).toFixed(1) + 'B';
  }
  if (xp >= 1000000) {
    return (xp / 1000000).toFixed(1) + 'M';
  }
  if (xp >= 1000) {
    return (xp / 1000).toFixed(1) + 'K';
  }
  return xp.toString();
}

// XP required for each level (0-indexed, where index 0 is level 1)
const XP_LEVELS = [
  0,     // Level 1: 0 XP
  100,   // Level 2: 100 XP
  300,   // Level 3: 300 XP
  600,   // Level 4: 600 XP
  1000,  // Level 5: 1000 XP
  1500,  // Level 6: 1500 XP
  2100,  // Level 7: 2100 XP
  2800,  // Level 8: 2800 XP
  3600,  // Level 9: 3600 XP
  4500,  // Level 10: 4500 XP
  5500,  // ... and so on
  6600,
  7800,
  9100,
  10500,
  12000,
  13600,
  15300,
  17100,
  19000,
  21000
];

// Max level in the game
const MAX_LEVEL = 20;

// Calculate level from XP
export function calculateLevel(xp) {
  // If XP is less than 0, return 1 (minimum level)
  if (xp < 0) return 1;
  
  // Find the highest level where required XP is less than or equal to current XP
  for (let level = 1; level <= MAX_LEVEL; level++) {
    if (xp < XP_LEVELS[level - 1]) {
      return level - 1;
    }
  }
  
  return MAX_LEVEL; // Cap at max level
}

// Calculate XP needed for a specific level
export function xpForLevel(level) {
  if (level < 1) return 0;
  if (level > MAX_LEVEL) return XP_LEVELS[MAX_LEVEL - 1];
  return XP_LEVELS[level - 1];
}

// Calculate XP needed for next level
export function xpForNextLevel(currentLevel) {
  if (currentLevel >= MAX_LEVEL) return 0; // No next level at max level
  return XP_LEVELS[currentLevel] - XP_LEVELS[currentLevel - 1];
}

// Calculate progress to next level
export function progressToNextLevel(xp) {
  const currentLevel = calculateLevel(xp);
  
  // If at max level, return 100% progress
  if (currentLevel >= MAX_LEVEL) {
    return {
      progress: 100,
      xpNeeded: 0,
      xpInCurrentLevel: 0,
      currentLevel,
      nextLevel: currentLevel
    };
  }
  
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  
  return {
    progress: Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100),
    xpNeeded: xpNeededForNextLevel,
    xpInCurrentLevel,
    currentLevel,
    nextLevel: currentLevel + 1
  };
}

// Calculate total XP needed to reach a specific level
export function totalXpToReachLevel(targetLevel) {
  if (targetLevel <= 1) return 0;
  if (targetLevel > MAX_LEVEL) targetLevel = MAX_LEVEL;
  return XP_LEVELS[targetLevel - 1];
}

// Generate a gradient from a string (for avatars, etc.)
export function stringToGradient(str) {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h = Math.abs(hash % 360);
  return `linear-gradient(135deg, hsl(${h}, 70%, 60%), hsl(${(h + 30) % 360}, 70%, 60%))`;
}
