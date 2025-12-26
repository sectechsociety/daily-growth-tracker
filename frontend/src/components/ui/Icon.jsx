import React from 'react';
import { 
  FaWater, FaHamburger, FaCoffee, FaRunning, FaCode, FaBook, FaMedal, 
  FaBed, FaPencilAlt, FaWalking, FaHeart, FaGraduationCap, FaMusic, 
  FaBroom, FaRobot, FaBullseye, FaCrown, FaFire, 
  FaCheck, FaTimes, FaStar, FaTrophy as FaTrophySolid
} from 'react-icons/fa';
import {
  FiList, FiAward, FiCalendar, FiStar, FiTrendingUp, FiActivity, FiUser,
  FiMenu, FiX
} from 'react-icons/fi';

const iconMap = {
  // Task Icons
  water: FaWater,
  food: FaHamburger,
  coffee: FaCoffee,
  run: FaRunning,
  code: FaCode,
  book: FaBook,
  meditation: FaMedal,
  moon: FaBed,
  write: FaPencilAlt,
  walk: FaWalking,
  heart: FaHeart,
  learn: FaGraduationCap,
  music: FaMusic,
  clean: FaBroom,
  
  // Navigation Icons
  list: FiList,
  trophy: FiAward,
  calendar: FiCalendar,
  ai: FaRobot,
  target: FaBullseye,
  leaderboard: FiTrendingUp,
  flame: FiActivity,
  user: FiUser,
  menu: FiMenu,
  x: FiX,
  starNav: FiStar,
  
  // Status Icons
  success: FaCheck,
  error: FaTimes,
  star: FaStar,
  celebration: FaTrophySolid
};

const Icon = ({ name, size = 20, color, className = '', ...props }) => {
  const IconComponent = iconMap[name] || FaStar;
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={`inline-block ${className}`}
      {...props}
    />
  );
};

export default Icon;
