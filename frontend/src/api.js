import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend API URL
});

// ========== USER ENDPOINTS ==========
// Get or create user profile
export const createOrGetUser = (userData) => API.post("/users/profile", userData);

// Get user profile by Firebase UID
export const getUserProfile = (firebaseUid) => API.get(`/users/profile/${firebaseUid}`);

// Update user profile
export const updateUserProfile = (firebaseUid, profileData) => 
  API.put(`/users/profile/${firebaseUid}`, profileData);

// Update user stats (XP, level, points, streak)
export const updateUserStats = (firebaseUid, stats) => 
  API.patch(`/users/profile/${firebaseUid}/stats`, stats);

// Add achievement to user
export const addAchievement = (firebaseUid, achievement) => 
  API.post(`/users/profile/${firebaseUid}/achievements`, achievement);

// ========== TASK ENDPOINTS ==========
// Get all tasks for a user
export const getTasks = (userId, params = {}) => API.get(`/tasks/${userId}`, { params });

// Get single task
export const getTask = (userId, taskId) => API.get(`/tasks/${userId}/${taskId}`);

// Create new task
export const createTask = (taskData) => API.post("/tasks", taskData);

// Update task
export const updateTask = (taskId, taskData) => API.put(`/tasks/${taskId}`, taskData);

// Complete task
export const completeTask = (taskId) => API.patch(`/tasks/${taskId}/complete`);

// Delete task
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);

// Get task statistics
export const getTaskStats = (userId) => API.get(`/tasks/${userId}/stats`);

// ========== PROGRESS ENDPOINTS ==========
// Get progress for a specific date
export const getProgress = (userId, date) => API.get(`/progress/${userId}/${date}`);

// Get progress history (last N days)
export const getProgressHistory = (userId, days) => 
  API.get(`/progress/${userId}/history/${days}`);

// Create or update daily progress
export const saveProgress = (progressData) => API.post("/progress", progressData);

// Get weekly summary
export const getWeeklySummary = (userId) => API.get(`/progress/${userId}/summary/week`);

// Get monthly summary
export const getMonthlySummary = (userId) => API.get(`/progress/${userId}/summary/month`);

// ========== LEADERBOARD ENDPOINTS ==========
// Get global leaderboard (by total points)
export const getGlobalLeaderboard = (limit = 10) => 
  API.get("/leaderboard/global", { params: { limit } });

// Get leaderboard by XP
export const getXPLeaderboard = (limit = 10) => 
  API.get("/leaderboard/xp", { params: { limit } });

// Get leaderboard by streak
export const getStreakLeaderboard = (limit = 10) => 
  API.get("/leaderboard/streak", { params: { limit } });

// Get user's rank
export const getUserRank = (firebaseUid) => API.get(`/leaderboard/rank/${firebaseUid}`);

// ========== HEALTH CHECK ==========
export const fetchBackendStatus = () => axios.get("http://localhost:5000/");

export default API;
