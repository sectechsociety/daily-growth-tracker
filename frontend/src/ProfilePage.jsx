import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User, Target, Award, Clock, CheckCircle,
  TrendingUp, Settings, LogOut, Edit3,
  Star, Zap, Heart, Lightbulb, Calendar,
  Quote, BookOpen, Sparkles, ArrowRight,
  Plus, ChevronRight, Flame, Camera, Upload,
  Bell, BellOff, Save, X, Mail, MapPin, Briefcase
} from "lucide-react";
import {
  auth,
  db,
  storage,
  onAuthStateChange,
  getUserProfile,
  subscribeToUserProfile,
  setTodayGoal,
  getTodayGoal,
  getQuoteOfTheDay,
  updateUserProfile
} from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Professional color palette (Calm + Notion + Apple inspired)
const COLORS = {
  primary: {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    green: '#10B981',
    orange: '#F59E0B',
    pink: '#EC4899',
    indigo: '#6366F1'
  },
  gradients: {
    primary: 'from-blue-500 via-purple-500 to-cyan-500',
    secondary: 'from-purple-500 via-pink-500 to-orange-500',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-orange-500 to-yellow-500',
    info: 'from-cyan-500 to-blue-500',
    calm: 'from-indigo-500 via-purple-500 to-pink-500'
  },
  backgrounds: {
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20',
    glassDark: 'bg-gray-900/90 backdrop-blur-xl border border-gray-700/50',
    card: 'bg-white/5 backdrop-blur-sm border border-white/10',
    cardHover: 'hover:bg-white/10 hover:border-white/20'
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [todayGoal, setTodayGoalState] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch user profile from Firestore with fallback
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Create default profile if none exists
            setUserProfile({
              name: firebaseUser.displayName || 'Growth Seeker',
              email: firebaseUser.email,
              level: 1,
              xp: 0,
              totalPoints: 0,
              streak: 0,
              tasksCompleted: 0,
              skillsUnlocked: 0,
              mindfulMinutes: 0,
              badges: []
            });
          }

          // Fetch today's goal with fallback
          try {
            const goal = await getTodayGoal(firebaseUser.uid);
            setTodayGoalState(goal);
          } catch (goalError) {
            console.warn('Could not fetch today\'s goal:', goalError);
            setTodayGoalState('');
          }

          // Fetch quote of the day (local fallback)
          try {
            const dailyQuote = await getQuoteOfTheDay();
            setQuote(dailyQuote);
          } catch (quoteError) {
            console.warn('Could not fetch quote:', quoteError);
            // Use local quote as fallback
            setQuote({
              text: "Every moment is a fresh beginning.",
              author: "T.S. Eliot"
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Use fallback profile data
          setUserProfile({
            name: firebaseUser.displayName || 'Growth Seeker',
            email: firebaseUser.email,
            level: 1,
            xp: 0,
            totalPoints: 0,
            streak: 0,
            tasksCompleted: 0,
            skillsUnlocked: 0,
            mindfulMinutes: 0,
            badges: []
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setTodayGoalState('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time profile updates
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToUserProfile(user.uid, (updatedProfile) => {
        setUserProfile(updatedProfile);
      });

      return () => unsubscribe();
    }
  }, [user?.uid]);

  // Calculate level progress
  const currentLevelXp = (userProfile?.level || 1) * 250;
  const nextLevelXp = ((userProfile?.level || 1) + 1) * 250;
  const progressPercent = Math.min(((userProfile?.xp || 0) - currentLevelXp) / 250 * 100, 100);

  // Get level name
  const getLevelName = (level) => {
    const levelNames = [
      'Sprout', 'Seedling', 'Bloom', 'Growth', 'Flourish',
      'Thrive', 'Excel', 'Master', 'Sage', 'Legend',
      'Champion', 'Hero', 'Titan', 'Oracle', 'Divine'
    ];
    return levelNames[level - 1] || 'Sprout';
  };

  // Handle setting today's goal
  const handleSetGoal = async () => {
    if (newGoal.trim() && user?.uid) {
      try {
        const { error } = await setTodayGoal(user.uid, newGoal.trim());

        if (error) {
          console.error('Error setting goal:', error);
          // For now, just show the goal locally even if Firestore fails
          setTodayGoalState(newGoal.trim());
        } else {
          setTodayGoalState(newGoal.trim());
        }

        setNewGoal('');
      } catch (error) {
        console.error('Error setting goal:', error);
        // Show goal locally as fallback
        setTodayGoalState(newGoal.trim());
        setNewGoal('');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);

      // Create a storage reference
      const storageRef = ref(storage, `profilePhotos/${user.uid}/${Date.now()}_${file.name}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const photoURL = await getDownloadURL(storageRef);

      // Update user profile in Firestore
      await updateUserProfile(user.uid, { photoURL });

      // Update local state
      setUserProfile(prev => ({ ...prev, photoURL }));

      console.log('✅ Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Trigger file input click
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle edit mode toggle
  const handleEditProfile = () => {
    if (!isEditMode) {
      setEditedProfile({
        name: userProfile?.name || user?.displayName || '',
        bio: userProfile?.bio || '',
        location: userProfile?.location || '',
        occupation: userProfile?.occupation || ''
      });
    }
    setIsEditMode(!isEditMode);
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!user?.uid) return;

    try {
      await updateUserProfile(user.uid, editedProfile);
      setUserProfile(prev => ({ ...prev, ...editedProfile }));
      setIsEditMode(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedProfile({});
  };

  // Handle notifications toggle
  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // You can add actual notification permission logic here
    console.log('Notifications:', !notificationsEnabled ? 'enabled' : 'disabled');
  };

  // Handle view journey
  const handleViewJourney = () => {
    navigate('/levels');
  };

  // Handle view stats
  const handleViewStats = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
          <p className="text-gray-400">Authentication required to access your growth dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-6 max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="relative inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            {/* Profile Photo with Glow and Upload */}
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-1 relative"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(6, 182, 212, 0.4)",
                  "0 0 0 8px rgba(6, 182, 212, 0)",
                  "0 0 0 0 rgba(6, 182, 212, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {(userProfile?.photoURL || user?.photoURL) ? (
                  <img
                    src={userProfile?.photoURL || user?.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-cyan-400" />
                )}
              </div>
              
              {/* Upload Button Overlay */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePhotoClick}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upload profile photo"
              >
                {uploadingPhoto ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </motion.button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </motion.div>
          </motion.div>

          {isEditMode ? (
            <div className="space-y-4 max-w-md mx-auto">
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                placeholder="Your Name"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white text-center text-2xl font-bold placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                  placeholder="📍 Location"
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={editedProfile.occupation}
                  onChange={(e) => setEditedProfile({ ...editedProfile, occupation: e.target.value })}
                  placeholder="💼 Occupation"
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {userProfile?.name || user.displayName || 'Growth Seeker'}
              </h1>
              {userProfile?.bio && (
                <p className="text-gray-300 mb-3 max-w-md mx-auto italic">"{userProfile.bio}"</p>
              )}
              <p className="text-gray-300 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Level {userProfile?.level || 1} — {getLevelName(userProfile?.level || 1)}
              </p>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <Mail className="w-3 h-3" />
                {user.email}
              </p>
              {(userProfile?.location || userProfile?.occupation) && (
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-400">
                  {userProfile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {userProfile.location}
                    </span>
                  )}
                  {userProfile?.occupation && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {userProfile.occupation}
                    </span>
                  )}
                </div>
              )}
            </>
          )}

          {/* XP Progress Bar */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Level Progress</span>
              <span className="text-sm text-cyan-400 font-medium">
                {(userProfile?.xp || 0) - currentLevelXp} / 250 XP
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: 'Tasks Completed',
              value: userProfile?.tasksCompleted || 0,
              icon: CheckCircle,
              gradient: COLORS.gradients.success,
              bgColor: 'bg-green-500/10',
              iconColor: 'text-green-400'
            },
            {
              label: 'Skills Unlocked',
              value: userProfile?.skillsUnlocked || 0,
              icon: Lightbulb,
              gradient: COLORS.gradients.warning,
              bgColor: 'bg-orange-500/10',
              iconColor: 'text-orange-400'
            },
            {
              label: 'Mindful Minutes',
              value: userProfile?.mindfulMinutes || 0,
              icon: Clock,
              gradient: COLORS.gradients.calm,
              bgColor: 'bg-purple-500/10',
              iconColor: 'text-purple-400'
            }
          ].map((stat, index) => (
            <motion.div
              key={`stat-${stat.label}-${index}`}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`${stat.bgColor} ${COLORS.backgrounds.glass} rounded-xl p-6 text-center border border-white/10 hover:border-white/20 transition-all duration-300`}
            >
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.gradient} mb-4`}>
                <stat.icon className={`${stat.iconColor} text-xl`} />
              </div>
              <motion.div
                className="font-bold text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {stat.value.toLocaleString()}
              </motion.div>
              <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Inspiration Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Daily Inspiration
          </h2>

          {quote && (
            <motion.div
              variants={cardVariants}
              className={`${COLORS.backgrounds.glass} rounded-xl p-6 mb-6 border border-white/10`}
            >
              <div className="flex items-start gap-4">
                <Quote className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-gray-200 mb-2 italic">"{quote.text}"</p>
                  <p className="text-cyan-400 font-medium">— {quote.author}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Today's Goal Section */}
          <motion.div
            variants={cardVariants}
            className={`${COLORS.backgrounds.glass} rounded-xl p-6 border border-white/10`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Today's Goal
            </h3>

            {todayGoal ? (
              <div className="mb-4">
                <p className="text-gray-200 mb-3">🎯 {todayGoal}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTodayGoalState('')}
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Change Goal
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="What would you like to accomplish today?"
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                  rows={3}
                />
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSetGoal}
                  disabled={!newGoal.trim()}
                  className={`w-full bg-gradient-to-r ${COLORS.gradients.primary} text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Set Today's Goal
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Growth Timeline */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Growth Journey
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { title: 'Started Journey', date: 'Today', xp: 0, description: 'Welcome to your growth journey!' },
              { title: 'First Steps', date: '1 day ago', xp: 100, description: 'Completed your first mindful session' },
              { title: 'Week Warrior', date: '3 days ago', xp: 500, description: 'Maintained a 7-day streak' }
            ].map((milestone, index) => {
              const isLast = index === 2;

              return (
                <motion.div
                  key={`milestone-${milestone.title}-${index}`}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-4 top-12 w-0.5 h-16 bg-gradient-to-b from-cyan-400 to-transparent" />
                  )}

                  {/* Milestone dot */}
                  <motion.div
                    className={`relative z-10 w-8 h-8 rounded-full ${COLORS.backgrounds.glass} flex items-center justify-center`}
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className={`w-3 h-3 rounded-full ${isLast ? 'bg-cyan-400' : 'bg-gray-400'} ${isLast ? 'animate-pulse' : ''}`} />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    variants={cardVariants}
                    className={`flex-1 ${COLORS.backgrounds.glass} rounded-xl p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{milestone.title}</h3>
                      <span className="text-xs text-gray-400">{milestone.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{milestone.description}</p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-cyan-400 font-medium">{milestone.xp.toLocaleString()} XP</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {(userProfile?.badges || [
              { name: 'First Steps', description: 'Completed your first task', rarity: 'common', icon: '🌱' },
              { name: 'Week Warrior', description: 'Maintained a 7-day streak', rarity: 'rare', icon: '⚡' },
              { name: 'Skill Master', description: 'Unlocked 10+ skills', rarity: 'epic', icon: '🎯' },
              { name: 'Growth Seeker', description: 'Reached level 15', rarity: 'legendary', icon: '🏆' }
            ]).map((badge, index) => {
              const rarityColors = {
                common: 'from-gray-400 to-gray-600',
                rare: 'from-blue-400 to-purple-500',
                epic: 'from-purple-500 to-pink-500',
                legendary: 'from-yellow-400 to-orange-500'
              };

              const rarity = badge.rarity || 'common';
              const validRarity = rarityColors[rarity] ? rarity : 'common';

              return (
                <motion.div
                  key={`badge-${badge.name}-${index}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`relative ${COLORS.backgrounds.glass} rounded-xl p-4 cursor-pointer group`}
                >
                  <div className={`w-full h-2 bg-gradient-to-r ${rarityColors[validRarity]} rounded-full mb-3`} />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {badge.description}
                    </p>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {validRarity.charAt(0).toUpperCase() + validRarity.slice(1)} Badge
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Profile updated successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          {/* Edit Mode Actions */}
          {isEditMode ? (
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Changes
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Cancel
                </div>
              </motion.button>
            </div>
          ) : (
            <>
              {/* Main Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditProfile}
                  className={`bg-gradient-to-r ${COLORS.gradients.primary} text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewJourney}
                  className={`bg-gradient-to-r ${COLORS.gradients.secondary} text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    View Journey
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewStats}
                  className={`bg-gradient-to-r ${COLORS.gradients.info} text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Dashboard
                  </div>
                </motion.button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleNotifications}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-5 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    {notificationsEnabled ? (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>Notifications On</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4" />
                        <span>Notifications Off</span>
                      </>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </div>
                </motion.button>
              </div>
            </>
          )}

          {/* Streak Display */}
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm">
              {userProfile?.streak || 0} day streak • Continue growing! 🌱
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Profile;
