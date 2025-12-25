# ⚡ Quick Start Guide

## 🚀 Get Running in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd my-backend
npm install dotenv
```

### 2️⃣ Create .env File
Create `my-backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/daily-growth-tracker
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Start Everything

**Terminal 1 - Backend:**
```bash
cd my-backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## ✅ Verify It Works

1. Open `http://localhost:5173`
2. Sign in with Google
3. Click "🔌 Test API" in navbar
4. Click test buttons

---

## 📦 What You Got

### Backend Structure
```
my-backend/
├── models/          # 4 MongoDB schemas
├── routes/          # 4 API route files
├── server.js        # Main server
└── .env            # Config (you create this)
```

### API Endpoints (40+ endpoints)
- **Users:** Profile, stats, achievements
- **Tasks:** CRUD, complete, stats
- **Progress:** Daily tracking, summaries
- **Leaderboard:** Rankings, user rank

### Frontend API Service
`src/api.js` - All backend functions ready to use

---

## 🎯 Quick Examples

### Create a Task
```javascript
import { createTask } from './api';

const task = await createTask({
  userId: user.uid,
  title: "Morning workout",
  category: "fitness",
  points: 20
});
```

### Complete a Task
```javascript
import { completeTask } from './api';

const result = await completeTask(taskId);
// User gets XP and points automatically!
```

### Get Leaderboard
```javascript
import { getGlobalLeaderboard } from './api';

const top10 = await getGlobalLeaderboard(10);
```

---

## 🗄️ MongoDB Options

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/daily-growth-tracker
```

**MongoDB Atlas (Cloud - Free):**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/daily-growth-tracker
```

---

## 📚 Full Documentation

- **Complete Setup:** `../FULL_SETUP_GUIDE.md`
- **API Reference:** `API_DOCUMENTATION.md`
- **Backend Connection:** `../BACKEND_SETUP.md`

---

**That's it! You're ready to build! 🎉**
