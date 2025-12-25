# Daily Growth Tracker - API Documentation

Base URL: `http://localhost:5000/api`

---

## 📋 Table of Contents
1. [User Endpoints](#user-endpoints)
2. [Task Endpoints](#task-endpoints)
3. [Progress Endpoints](#progress-endpoints)
4. [Leaderboard Endpoints](#leaderboard-endpoints)

---

## 👤 User Endpoints

### Create or Get User Profile
**POST** `/api/users/profile`

Creates a new user or returns existing user.

**Request Body:**
```json
{
  "firebaseUid": "string (required)",
  "email": "string (required)",
  "name": "string (optional)",
  "photoURL": "string (optional)"
}
```

**Response:**
```json
{
  "_id": "string",
  "firebaseUid": "string",
  "email": "string",
  "name": "string",
  "bio": "string",
  "photoURL": "string",
  "level": 1,
  "xp": 0,
  "totalPoints": 0,
  "streak": 0,
  "achievements": []
}
```

---

### Get User Profile
**GET** `/api/users/profile/:firebaseUid`

**Response:** Same as above

---

### Update User Profile
**PUT** `/api/users/profile/:firebaseUid`

**Request Body:**
```json
{
  "name": "string",
  "bio": "string",
  "photoURL": "string"
}
```

---

### Update User Stats
**PATCH** `/api/users/profile/:firebaseUid/stats`

**Request Body:**
```json
{
  "xp": 150,
  "level": 2,
  "totalPoints": 250,
  "streak": 7
}
```

---

### Add Achievement
**POST** `/api/users/profile/:firebaseUid/achievements`

**Request Body:**
```json
{
  "name": "First Task",
  "icon": "🎯"
}
```

---

## ✅ Task Endpoints

### Get All Tasks
**GET** `/api/tasks/:userId`

**Query Parameters:**
- `status` - Filter by status (pending, in-progress, completed, cancelled)
- `category` - Filter by category (fitness, learning, work, personal, health, other)

**Response:**
```json
[
  {
    "_id": "string",
    "userId": "string",
    "title": "Complete workout",
    "description": "30 min cardio",
    "category": "fitness",
    "priority": "high",
    "status": "pending",
    "dueDate": "2025-10-02T00:00:00.000Z",
    "points": 20,
    "isRecurring": false,
    "createdAt": "2025-10-01T00:00:00.000Z"
  }
]
```

---

### Get Single Task
**GET** `/api/tasks/:userId/:taskId`

---

### Create Task
**POST** `/api/tasks`

**Request Body:**
```json
{
  "userId": "string (required)",
  "title": "string (required)",
  "description": "string",
  "category": "fitness|learning|work|personal|health|other",
  "priority": "low|medium|high",
  "dueDate": "2025-10-02",
  "points": 20,
  "isRecurring": false,
  "recurringType": "daily|weekly|monthly"
}
```

---

### Update Task
**PUT** `/api/tasks/:taskId`

**Request Body:** Same fields as Create Task

---

### Complete Task
**PATCH** `/api/tasks/:taskId/complete`

Marks task as completed and awards points/XP to user.

**Response:**
```json
{
  "task": { /* updated task */ },
  "user": { /* updated user with new XP/level */ }
}
```

---

### Delete Task
**DELETE** `/api/tasks/:taskId`

---

### Get Task Statistics
**GET** `/api/tasks/:userId/stats`

**Response:**
```json
{
  "totalTasks": 50,
  "completedTasks": 35,
  "pendingTasks": 10,
  "inProgressTasks": 5,
  "tasksByCategory": [
    { "_id": "fitness", "count": 15 },
    { "_id": "learning", "count": 20 }
  ]
}
```

---

## 📊 Progress Endpoints

### Get Progress for Date
**GET** `/api/progress/:userId/:date`

Date format: `YYYY-MM-DD`

---

### Get Progress History
**GET** `/api/progress/:userId/history/:days`

Get last N days of progress. Example: `/api/progress/user123/history/7`

---

### Save Daily Progress
**POST** `/api/progress`

**Request Body:**
```json
{
  "userId": "string (required)",
  "date": "2025-10-01",
  "tasksCompleted": 5,
  "pointsEarned": 50,
  "xpGained": 50,
  "mood": "great|good|okay|bad|terrible",
  "notes": "Had a productive day!",
  "activities": [
    {
      "type": "exercise",
      "duration": 30,
      "description": "Morning run"
    }
  ]
}
```

---

### Get Weekly Summary
**GET** `/api/progress/:userId/summary/week`

**Response:**
```json
{
  "totalTasksCompleted": 25,
  "totalPointsEarned": 250,
  "totalXpGained": 250,
  "daysActive": 7,
  "dailyBreakdown": [ /* array of daily progress */ ]
}
```

---

### Get Monthly Summary
**GET** `/api/progress/:userId/summary/month`

Similar to weekly summary but for 30 days.

---

## 🏆 Leaderboard Endpoints

### Global Leaderboard (by Points)
**GET** `/api/leaderboard/global?limit=10`

**Response:**
```json
[
  {
    "rank": 1,
    "_id": "string",
    "name": "John Doe",
    "email": "john@example.com",
    "photoURL": "string",
    "level": 5,
    "xp": 500,
    "totalPoints": 1000,
    "streak": 15
  }
]
```

---

### Leaderboard by XP
**GET** `/api/leaderboard/xp?limit=10`

---

### Leaderboard by Streak
**GET** `/api/leaderboard/streak?limit=10`

---

### Get User Rank
**GET** `/api/leaderboard/rank/:firebaseUid`

**Response:**
```json
{
  "rank": 42,
  "totalPoints": 350,
  "xp": 350,
  "level": 4,
  "streak": 5
}
```

---

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd my-backend
npm install
```

### 2. Configure Environment
Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/daily-growth-tracker
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Start Server
```bash
npm start
```

---

## 📝 Frontend Usage Examples

```javascript
import { createTask, completeTask, getGlobalLeaderboard } from './api';

// Create a task
const newTask = await createTask({
  userId: user.uid,
  title: "Morning workout",
  category: "fitness",
  priority: "high",
  points: 20
});

// Complete a task
const result = await completeTask(taskId);
console.log("New XP:", result.data.user.xp);

// Get leaderboard
const leaderboard = await getGlobalLeaderboard(10);
```

---

## 🚀 Features

- ✅ User profile management with XP and levels
- ✅ Task creation, tracking, and completion
- ✅ Daily progress tracking with mood and activities
- ✅ Weekly and monthly summaries
- ✅ Global leaderboard system
- ✅ Achievement system
- ✅ Streak tracking
- ✅ Category-based task organization
- ✅ Recurring tasks support

---

## 📦 Database Models

### User
- Firebase UID, email, name, bio, photo
- Level, XP, total points, streak
- Achievements array
- Last active date

### Task
- User ID, title, description
- Category, priority, status
- Due date, completion date
- Points, recurring settings

### Progress
- User ID, date
- Tasks completed, points earned, XP gained
- Mood, notes, activities

### Achievement
- Name, description, icon
- Category, requirement, XP reward
