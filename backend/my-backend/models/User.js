const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 15 Level System (1000 XP to 15000 XP)
const LEVELS = [
  { id: 1, name: "Novice", xpRequired: 1000 },
  { id: 2, name: "Apprentice", xpRequired: 2000 },
  { id: 3, name: "Warrior", xpRequired: 3000 },
  { id: 4, name: "Champion", xpRequired: 4000 },
  { id: 5, name: "Gladiator", xpRequired: 5000 },
  { id: 6, name: "Conqueror", xpRequired: 6000 },
  { id: 7, name: "Warlord", xpRequired: 7000 },
  { id: 8, name: "Titan", xpRequired: 8000 },
  { id: 9, name: "Immortal", xpRequired: 9000 },
  { id: 10, name: "Celestial", xpRequired: 10000 },
  { id: 11, name: "Divine", xpRequired: 11000 },
  { id: 12, name: "Mythic", xpRequired: 12000 },
  { id: 13, name: "Ascendant", xpRequired: 13000 },
  { id: 14, name: "Transcendent", xpRequired: 14000 },
  { id: 15, name: "Omnipotent", xpRequired: 15000 },
];

const userSchema = new mongoose.Schema({
  // Firebase authentication (optional for JWT users)
  firebaseUid: { type: String, unique: true, sparse: true },

  // JWT authentication (email as unique identifier)
  email: {
    type: String,
    required: function() { return !this.firebaseUid; }, // Required if no firebaseUid
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },

  // Password for JWT authentication (hashed)
  password: { type: String },

  // User profile information
  name: { type: String, required: true, trim: true },
  bio: { type: String, default: "" },
  photoURL: { type: String, default: "" },

  // Gaming/progress fields
  level: { type: Number, default: 1, min: 1, max: 15 },
  xp: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  tasksCompleted: { type: Number, default: 0 },

  // Calorie tracking preferences and stats
  defaultDailyCalorieGoal: { type: Number, default: 2000, min: 500, max: 10000 },
  totalCaloriesTracked: { type: Number, default: 0 },
  caloriesGoalStreak: { type: Number, default: 0 },
  bestCalorieStreak: { type: Number, default: 0 },
  totalMealsLogged: { type: Number, default: 0 },
  favoriteFoods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],

  // Avatar customization data
  avatar: {
    skin: { type: String, default: '#FDBCB4' },
    hair: {
      style: { type: String, default: 'short' },
      color: { type: String, default: '#2C1B18' }
    },
    eyes: { type: String, default: '#8B4513' },
    clothes: {
      top: { type: String, default: 'tshirt' },
      color: { type: String, default: '#4ECDC4' }
    },
    accessories: { type: String, default: 'none' }
  },

  // Authentication method tracking
  authMethod: { type: String, enum: ['firebase', 'jwt'], default: 'jwt' }
}, { timestamps: true });

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });
userSchema.pre('save', async function(next) {
  // Only hash password if it's a JWT user and password is modified
  if (!this.isModified('password') || !this.password || this.authMethod === 'firebase') {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method (for JWT users)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.authMethod === 'firebase' || !this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find or create user (supports both auth methods)
userSchema.statics.findOrCreateByAuth = async function(authData) {
  const { firebaseUid, email, name, authMethod = 'jwt' } = authData;

  let user;

  if (authMethod === 'firebase' && firebaseUid) {
    user = await this.findOne({ firebaseUid });
    if (!user) {
      user = new this({
        firebaseUid,
        email,
        name: name || email?.split('@')[0] || 'User',
        authMethod: 'firebase'
      });
      await user.save();
    }
  } else if (authMethod === 'jwt' && email) {
    user = await this.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new this({
        email: email.toLowerCase(),
        name,
        authMethod: 'jwt'
      });
      await user.save();
    }
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
