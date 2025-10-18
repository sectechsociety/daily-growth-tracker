const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // Allow all origins for testing
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/daily-growth-tracker";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import Routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const progressRoutes = require("./routes/progressRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const calorieRoutes = require("./routes/calorieRoutes");

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    message: "Daily Growth Tracker API 🚀",
    status: "running",
    endpoints: {
      users: "/api/users",
      tasks: "/api/tasks",
      progress: "/api/progress",
      leaderboard: "/api/leaderboard",
      auth: "/api/auth",
      foods: "/api/foods",
      calories: "/api/calories",
    },
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/calories", calorieRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});