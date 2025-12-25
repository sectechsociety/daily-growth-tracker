import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User, Award, Clock, CheckCircle, TrendingUp, Edit3, Zap,
  Calendar, Sparkles, Camera, Upload, Save, X, Mail, MapPin, Phone, Users
} from "lucide-react";
import { theme } from "./theme";
import {
  auth,
  onAuthStateChange,
  getUserProfile,
  updateUserProfile,
  storage
} from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Built-in avatar emojis
const AVATAR_EMOJIS = [
  { id: 1, emoji: "😊", label: "Happy" },
  { id: 2, emoji: "🎮", label: "Gamer" },
  { id: 3, emoji: "🚀", label: "Rocket" },
  { id: 4, emoji: "⭐", label: "Star" },
  { id: 5, emoji: "🎯", label: "Target" }
];

// Get today's XP from localStorage
const getTodayXP = () => {
  const today = new Date().toISOString().split('T')[0];
  const dailyXPData = JSON.parse(localStorage.getItem('dailyXP') || '{}');
  return dailyXPData[today] || 0;
};

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    country: "",
    age: "",
    photoURL: "",
    level: 1,
    xp: 0,
    streak: 0,
    lastSignedIn: new Date(),
    tasksCompleted: 0
  });

  // Edit form state
  const [editForm, setEditForm] = useState({ ...profileData });

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Fetch profile from Firestore
          const profile = await getUserProfile(firebaseUser.uid);
          
          // Parse name into first and last name
          const [firstName = "", ...lastNameParts] = (profile?.name || firebaseUser?.displayName || "").split(" ");
          const lastName = lastNameParts.join(" ");

          const userData = {
            firstName,
            lastName,
            email: profile?.email || firebaseUser.email || "",
            mobile: profile?.mobile || "",
            gender: profile?.gender || "",
            country: profile?.country || "",
            age: profile?.age || "",
            photoURL: profile?.photoURL || firebaseUser.photoURL || "",
            level: profile?.level || 1,
            xp: profile?.xp || 0,
            streak: profile?.streak || 0,
            lastSignedIn: new Date(),
            tasksCompleted: profile?.tasksCompleted || 0
          };

          setProfileData(userData);
          setEditForm(userData);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle profile picture upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `profilePhotos/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      setEditForm({ ...editForm, photoURL });
      setShowAvatarPicker(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      // Fallback to local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, photoURL: reader.result });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle avatar emoji selection
  const handleAvatarSelect = (emoji) => {
    setEditForm({ ...editForm, photoURL: emoji });
    setShowAvatarPicker(false);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      if (user?.uid) {
        // Update in Firestore
        await updateUserProfile(user.uid, {
          name: `${editForm.firstName} ${editForm.lastName}`.trim(),
          email: editForm.email,
          mobile: editForm.mobile,
          gender: editForm.gender,
          country: editForm.country,
          age: editForm.age,
          photoURL: editForm.photoURL
        });
      }
      
      // Update state
      setProfileData(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditForm(profileData);
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#F5F3FF"
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: "64px",
            height: "64px",
            border: "4px solid #8B7FC7",
            borderTopColor: "transparent",
            borderRadius: "50%"
          }}
        />
      </div>
    );
  }

  const todayXP = getTodayXP();
  
  // Calculate today's XP progress percentage (out of 100)
  const xpProgressPercentage = Math.min(todayXP, 100);
  
  // Use stored level from profileData (dashboard system: Math.floor(xp / 100) + 1)
  console.log('ProfilePage - Total XP:', profileData.xp, 'Stored Level:', profileData.level, 'Today XP:', todayXP, 'XP Progress:', xpProgressPercentage + '%');

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F3FF",
      padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: theme.textPrimary,
            marginBottom: "32px",
            textAlign: "center"
          }}
        >
          My Profile
        </motion.h1>

        {/* Main Profile Container */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {/* Left Column - Profile Header & Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                position: "relative"
              }}
            >
              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: theme.accent,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                }}
              >
                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                {isEditing ? "Cancel" : "Edit"}
              </motion.button>

              {/* Profile Picture Section */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px"
              }}>
                <div style={{ position: "relative" }}>
                  {/* Profile Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      background: profileData.photoURL && !profileData.photoURL.includes('http') && profileData.photoURL.length < 10
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: profileData.photoURL?.length < 10 ? "4rem" : "3rem",
                      fontWeight: "700",
                      color: "#ffffff",
                      border: "6px solid #ffffff",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                      overflow: "hidden",
                      position: "relative"
                    }}
                  >
                    {profileData.photoURL ? (
                      profileData.photoURL.length < 10 ? (
                        <span>{profileData.photoURL}</span>
                      ) : (
                        <img
                          src={profileData.photoURL}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )
                    ) : (
                      <User size={56} color="#9ca3af" />
                    )}
                  </motion.div>

                  {/* Camera Icon Overlay - Purple Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => isEditing && setShowAvatarPicker(!showAvatarPicker)}
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isEditing && !uploadingPhoto ? "pointer" : "not-allowed",
                      boxShadow: "0 8px 24px rgba(139, 127, 199, 0.5)",
                      opacity: uploadingPhoto ? 0.6 : 1,
                      zIndex: 999
                    }}
                  >
                    {uploadingPhoto ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "3px solid #8B7FC7",
                          borderTopColor: "transparent",
                          borderRadius: "50%"
                        }}
                      />
                    ) : (
                      <Camera size={28} color="#8B7FC7" strokeWidth={2.5} />
                    )}
                  </motion.div>
                </div>

                {/* User Name */}
                <motion.h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: theme.textPrimary,
                    marginTop: "16px",
                    marginBottom: "4px",
                    textAlign: "center"
                  }}
                >
                  {profileData.firstName} {profileData.lastName}
                </motion.h2>

                {/* Level Badge */}
                <div style={{
                  background: theme.accent,
                  color: "#ffffff",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "8px"
                }}>
                  <Award size={16} />
                  Level {profileData.level}
                </div>
              </div>

              {/* Avatar Picker Modal */}
              <AnimatePresence>
                {showAvatarPicker && isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      background: "#f9fafb",
                      borderRadius: "16px",
                      padding: "20px",
                      marginBottom: "20px",
                      border: "2px solid #e5e7eb"
                    }}
                  >
                    <h3 style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: theme.textPrimary,
                      marginBottom: "12px"
                    }}>
                      Choose Avatar
                    </h3>

                    {/* Avatar Emojis */}
                    <div style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "16px"
                    }}>
                      {AVATAR_EMOJIS.map((avatar) => (
                        <motion.button
                          key={avatar.id}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAvatarSelect(avatar.emoji)}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "#ffffff",
                            border: "3px solid #e5e7eb",
                            fontSize: "2rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                        >
                          {avatar.emoji}
                        </motion.button>
                      ))}
                    </div>

                    {/* Upload Photo Button */}
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: theme.accent,
                      color: "#ffffff",
                      padding: "10px 16px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.2s"
                    }}>
                      <Upload size={16} />
                      Upload Photo
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* User Information Form/Display */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* First Name */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "8px"
                  }}>
                    <User size={14} />
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        background: "#ffffff",
                        color: "#2D3748"
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.accent}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  ) : (
                    <div style={{
                      padding: "12px 16px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      fontSize: "15px",
                      color: theme.textPrimary,
                      fontWeight: "500"
                    }}>
                      {profileData.firstName || "Not set"}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "8px"
                  }}>
                    <User size={14} />
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        background: "#ffffff",
                        color: "#2D3748"
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.accent}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  ) : (
                    <div style={{
                      padding: "12px 16px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      fontSize: "15px",
                      color: theme.textPrimary,
                      fontWeight: "500"
                    }}>
                      {profileData.lastName || "Not set"}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "8px"
                  }}>
                    <Mail size={14} />
                    Email Address
                  </label>
                  <div style={{
                    padding: "12px 16px",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    fontSize: "15px",
                    color: theme.textSecondary,
                    fontWeight: "500",
                    border: "2px solid #e5e7eb"
                  }}>
                    {profileData.email || "Not set"}
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "8px"
                  }}>
                    <Phone size={14} />
                    Mobile Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      placeholder="+1 (234) 567-8900"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        background: "#ffffff",
                        color: "#2D3748"
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.accent}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  ) : (
                    <div style={{
                      padding: "12px 16px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      fontSize: "15px",
                      color: theme.textPrimary,
                      fontWeight: "500"
                    }}>
                      {profileData.mobile || "Not set"}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "8px"
                  }}>
                    <Users size={14} />
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        background: "#ffffff",
                        cursor: "pointer",
                        color: "#2D3748"
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.accent}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    >
                      <option value="" style={{ color: "#2D3748" }}>Select Gender</option>
                      <option value="male" style={{ color: "#2D3748" }}>Male</option>
                      <option value="female" style={{ color: "#2D3748" }}>Female</option>
                      <option value="other" style={{ color: "#2D3748" }}>Other</option>
                      <option value="prefer-not-to-say" style={{ color: "#2D3748" }}>Prefer not to say</option>
                    </select>
                  ) : (
                    <div style={{
                      padding: "12px 16px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      fontSize: "15px",
                      color: theme.textPrimary,
                      fontWeight: "500",
                      textTransform: "capitalize"
                    }}>
                      {profileData.gender || "Not set"}
                    </div>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "8px"
                  }}>
                    <Calendar size={14} />
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="25"
                      min="1"
                      max="120"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        background: "#ffffff",
                        color: "#2D3748"
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.accent}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  ) : (
                    <div style={{
                      padding: "12px 16px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      fontSize: "15px",
                      color: theme.textPrimary,
                      fontWeight: "500"
                    }}>
                      {profileData.age ? `${profileData.age} years` : "Not set"}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "8px"
                  }}>
                    <MapPin size={14} />
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="United States"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        background: "#ffffff",
                        color: "#2D3748"
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.accent}
                      onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                    />
                  ) : (
                    <div style={{
                      padding: "12px 16px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      fontSize: "15px",
                      color: theme.textPrimary,
                      fontWeight: "500"
                    }}>
                      {profileData.country || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button (visible when editing) */}
              <AnimatePresence>
                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      padding: "14px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: "18px",
                            height: "18px",
                            border: "2px solid #ffffff",
                            borderTopColor: "transparent",
                            borderRadius: "50%"
                          }}
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Last Signed In Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "20px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: theme.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Calendar size={20} color="#ffffff" />
                </div>
                <div>
                  <p style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: theme.textSecondary,
                    marginBottom: "2px"
                  }}>
                    Last Signed In
                  </p>
                  <p style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: theme.textPrimary
                  }}>
                    {new Date(profileData.lastSignedIn).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} at {new Date(profileData.lastSignedIn).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Activity & Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* XP & Level Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)"
              }}
            >
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: theme.textPrimary,
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <Sparkles size={24} color={theme.accent} />
                Today's Progress
              </h3>

              {/* XP Progress Circle */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px"
              }}>
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#xpGradient)"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - xpProgressPercentage / 100)}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - xpProgressPercentage / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B7FC7" />
                        <stop offset="100%" stopColor="#7a6db5" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center Content */}
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "2rem",
                      fontWeight: "800",
                      color: theme.textPrimary,
                      lineHeight: "1"
                    }}>
                      {Math.round(xpProgressPercentage)}%
                    </div>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: theme.textSecondary,
                      marginTop: "4px"
                    }}>
                      Level {profileData.level}
                    </div>
                  </div>
                </div>

                {/* XP Info */}
                <div style={{
                  width: "100%",
                  background: "#f9fafb",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: theme.accent,
                    marginBottom: "4px"
                  }}>
                    {todayXP}/100 XP
                  </div>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary
                  }}>
                    Daily XP Progress
                  </div>
                </div>
              </div>

              {/* Progress Bar Alternative */}
              <div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.textSecondary
                  }}>
                    Today's XP
                  </span>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: theme.accent
                  }}>
                    {todayXP}/100
                  </span>
                </div>
                <div style={{
                  width: "100%",
                  height: "12px",
                  background: "#f3f4f6",
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${todayXP}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: theme.accent,
                      borderRadius: "20px",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      animate={{
                        x: ["-100%", "200%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "50%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)"
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px"
              }}
            >
              {/* XP Earned */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  background: theme.accent,
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 12px 40px rgba(139, 127, 199, 0.3)",
                  color: "#ffffff"
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px"
                }}>
                  <Zap size={24} />
                </div>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  marginBottom: "4px"
                }}>
                  {profileData.xp.toLocaleString()}
                </div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  opacity: 0.9
                }}>
                  Total XP Earned
                </div>
              </motion.div>

              {/* Current Level */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  background: theme.accent,
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 12px 40px rgba(139, 127, 199, 0.3)",
                  color: "#ffffff"
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px"
                }}>
                  <TrendingUp size={24} />
                </div>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  marginBottom: "4px"
                }}>
                  {profileData.level}
                </div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  opacity: 0.9
                }}>
                  Current Level
                </div>
              </motion.div>

              {/* Streak */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  background: theme.accent,
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 12px 40px rgba(139, 127, 199, 0.3)",
                  color: "#ffffff"
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px"
                }}>
                  <Calendar size={24} />
                </div>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  marginBottom: "4px"
                }}>
                  {profileData.streak}
                </div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  opacity: 0.9
                }}>
                  Day Streak
                </div>
              </motion.div>

              {/* Tasks Completed */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  background: theme.accent,
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 12px 40px rgba(139, 127, 199, 0.3)",
                  color: "#ffffff"
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px"
                }}>
                  <CheckCircle size={24} />
                </div>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  marginBottom: "4px"
                }}>
                  {profileData.tasksCompleted}
                </div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  opacity: 0.9
                }}>
                  Tasks Completed
                </div>
              </motion.div>
            </motion.div>

            {/* Achievements Badge (Placeholder) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
                border: "2px dashed #e5e7eb"
              }}
            >
              <h3 style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: theme.textPrimary,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <Award size={20} color={theme.accent} />
                Achievements
              </h3>
              <p style={{
                fontSize: "14px",
                color: theme.textSecondary,
                lineHeight: "1.6"
              }}>
                Keep completing tasks to unlock special achievements and badges! 🏆
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfilePage;
