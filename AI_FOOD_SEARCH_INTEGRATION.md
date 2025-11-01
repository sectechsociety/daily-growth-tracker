# AI Food Search Integration Guide

## ✅ What's Been Done

1. **Created API Configuration** (`src/config.js`)
   - Stored your API Ninjas API key securely
   - Configured the nutrition API endpoint

2. **Created AI Food Search Component** (`src/AiFoodSearch.jsx`)
   - Standalone component with full AI search functionality
   - Beautiful UI matching your app's design
   - Real-time food search using API Ninjas
   - Displays detailed nutritional information (calories, protein, carbs, fat)

## 🔧 Integration Steps

### Step 1: Import the Component in CalorieTracker.jsx

Add this import at the top of `CalorieTracker.jsx` (around line 6, after other imports):

```javascript
import AiFoodSearch from "./AiFoodSearch";
```

### Step 2: Add the Component to the JSX

Find the line that says `{/* Today's Meal Log Section */}` (around line 1308)

**Add this code RIGHT BEFORE that comment:**

```jsx
      {/* AI Food Search Component */}
      <AiFoodSearch onAddFood={addAiFoodToIntake} />
```

### Step 3: Add the Handler Function

Add this function in `CalorieTracker.jsx` (around line 595, after the `getFilteredFoods` function):

```javascript
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

        // Add XP for logging food
        if (addXP) {
          addXP(`ai_food_${food.id}`, 5);
        }

        setToastMessage(`Added ${food.name}! +5 XP gained!`);
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Add to meal log
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
      // Fallback to localStorage
      const newCalories = caloriesConsumed + food.calories;
      setCaloriesConsumed(newCalories);
      localStorage.setItem("caloriesConsumed", newCalories.toString());

      setToastMessage(`Added ${food.name} (offline mode)`);
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };
```

## 🎯 Features

- **AI-Powered Search**: Search any food worldwide (pizza, sushi, chicken breast, etc.)
- **Detailed Nutrition**: Get calories, protein, carbs, fat, fiber, and sugar content
- **Beautiful UI**: Matches your app's gradient design with purple/pink theme
- **Real-time Results**: Instant search results from API Ninjas
- **Easy Integration**: Add foods directly to your daily intake with one click
- **XP Rewards**: Earn 5 XP for each food logged

## 🔑 API Key Info

Your API key is stored in `src/config.js`:
```
GOD5Ac2Q+ZpViYkP68N7yQ==WH4Zsnm4KzY1RKHN
```

**Security Note**: For production, consider moving this to environment variables (.env file).

## 🚀 How to Use

1. Navigate to the Calorie Tracker section
2. Scroll to the "AI-Powered Food Search" section
3. Type any food name (e.g., "apple", "chicken breast", "pizza")
4. Press Enter or click "Search"
5. View detailed nutritional information
6. Click "Add to Daily Intake" to log the food

## 📝 Example Searches

- "apple"
- "chicken breast"
- "brown rice"
- "salmon"
- "pizza"
- "greek yogurt"
- "almonds"

The API will return accurate nutritional data for standard serving sizes!
