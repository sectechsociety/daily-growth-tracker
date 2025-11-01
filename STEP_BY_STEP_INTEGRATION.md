# 🚀 Step-by-Step AI Food Search Integration

## Current Status ✅
- ✅ API Config file created (`src/config.js`)
- ✅ API Config imported in CalorieTracker.jsx (line 6)
- ✅ AI Food Search component created (`src/AiFoodSearch.jsx`)

## What You Need to Do (3 Simple Steps)

---

### **STEP 1: Add Import Statement**

**Location:** Line 6 in `CalorieTracker.jsx` (right after the API_CONFIG import)

**Current code (line 5-7):**
```javascript
import { getAllIndianFoods, getFoodsByCategory, searchFoods } from "./indianFoodData";
import { API_CONFIG } from "./config";

const CalorieTracker = ({ user, addXP, userStats, setUserStats }) => {
```

**Change to:**
```javascript
import { getAllIndianFoods, getFoodsByCategory, searchFoods } from "./indianFoodData";
import { API_CONFIG } from "./config";
import AiFoodSearch from "./AiFoodSearch";

const CalorieTracker = ({ user, addXP, userStats, setUserStats }) => {
```

**What to add:** Just add this one line after line 6:
```javascript
import AiFoodSearch from "./AiFoodSearch";
```

---

### **STEP 2: Add the Handler Function**

**Location:** Around line 595 (after the `getFilteredFoods` function, before the `safeDailyGoal` calculations)

**Find this section:**
```javascript
  return foods;
};

// Safe calculations with defaults
const safeDailyGoal = dailyGoal || 2000;
```

**Add this function BETWEEN those two sections:**

```javascript
  return foods;
};

// Add AI-searched food to intake
const addAiFoodToIntake = async (food) => {
  try {
    const response = await makeAuthenticatedRequest('/calories/add-meal', {
      name: food.name,
      calories: food.calories,
      category: 'ai_search',
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    }, 'POST');

    if (response.data.success) {
      setCaloriesConsumed(response.data.calorieEntry.totalCalories);
      setMeals(response.data.calorieEntry.meals);

      if (addXP) {
        addXP(`ai_food_${food.id}`, 5);
      }

      setToastMessage(`Added ${food.name}! +5 XP gained!`);
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      const mealLogItem = {
        id: food.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        category: 'ai_search',
        timestamp: new Date().toISOString(),
        source: 'ai_search'
      };
      setTodayMealLog(prev => [...prev, mealLogItem]);
      localStorage.setItem("todayMealLog", JSON.stringify([...todayMealLog, mealLogItem]));
    }
  } catch (error) {
    console.error('Error adding AI food:', error);
    const newCalories = caloriesConsumed + food.calories;
    setCaloriesConsumed(newCalories);
    localStorage.setItem("caloriesConsumed", newCalories.toString());

    setToastMessage(`Added ${food.name} (offline mode)`);
    setToastType("success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }
};

// Safe calculations with defaults
const safeDailyGoal = dailyGoal || 2000;
```

---

### **STEP 3: Add the Component to JSX**

**Location:** Around line 1307 (find the comment `{/* Today's Meal Log Section */}`)

**Find this:**
```jsx
      </motion.div>

      {/* Today's Meal Log Section */}
      <motion.div
        ref={mealLogRef}
```

**Change to:**
```jsx
      </motion.div>

      {/* AI Food Search Component */}
      <AiFoodSearch onAddFood={addAiFoodToIntake} />

      {/* Today's Meal Log Section */}
      <motion.div
        ref={mealLogRef}
```

**What to add:** Just add these 2 lines before the "Today's Meal Log Section" comment:
```jsx
{/* AI Food Search Component */}
<AiFoodSearch onAddFood={addAiFoodToIntake} />
```

---

## 🎯 Quick Search Guide

To find the exact locations quickly:

1. **For Step 1:** Press `Ctrl+G` and go to line 6
2. **For Step 2:** Press `Ctrl+F` and search for: `return foods;`
3. **For Step 3:** Press `Ctrl+F` and search for: `Today's Meal Log Section`

---

## ✅ Verification

After making these changes, your app should have:
- A new "AI-Powered Food Search" section in the Calorie Tracker
- Ability to search any food worldwide
- Detailed nutritional information display
- One-click add to daily intake

---

## 🧪 Test It

1. Save all files
2. Run your app (if not already running)
3. Go to Calorie Tracker
4. Scroll down to see the new "🤖 AI-Powered Food Search" section
5. Search for "apple" or "chicken breast"
6. Click "Add to Daily Intake" on any result

---

## 🆘 Need Help?

If you encounter any issues:
- Make sure all 3 steps are completed
- Check the browser console for errors
- Verify the API key is correct in `src/config.js`
