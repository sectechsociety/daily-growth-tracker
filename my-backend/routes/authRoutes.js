const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// JWT secret - in production, store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      bio: '',
      progress: 0,
      level: 1,
      xp: 0,
      totalPoints: 0,
      streak: 0,
      tasksCompleted: 0,
      authMethod: 'jwt'
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data (excluding password) and token
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      progress: user.progress,
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      streak: user.streak,
      lastActiveDate: user.lastActiveDate,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last active date
    user.lastActiveDate = new Date();
    await user.save();

    // Return user data (excluding password) and token
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      progress: user.progress,
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      streak: user.streak,
      lastActiveDate: user.lastActiveDate,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Verify JWT token and get user data
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user data
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        progress: user.progress,
        level: user.level,
        xp: user.xp,
        totalPoints: user.totalPoints,
        streak: user.streak,
        lastActiveDate: user.lastActiveDate,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Server error during token verification' });
  }
});

// Logout (client-side should remove token from storage)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validation
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// Get all users (for testing)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
