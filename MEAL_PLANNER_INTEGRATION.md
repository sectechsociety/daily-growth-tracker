# 🎯 AI Meal Planner Integration Guide

## ✅ What's Been Created

**File:** `src/AiMealPlanner.jsx`

A complete AI-powered meal planning component that:
- 📅 Generates 7-day meal plans automatically
- 🎯 Supports weight loss, weight gain, and maintenance goals
- 🥗 Offers diet preferences (Balanced, Vegetarian, High Protein)
- 🍴 Customizable meals per day (3, 4, or 5 meals)
- 📊 Shows detailed nutrition info for each meal
- 🤖 Uses API Ninjas to fetch real nutritional data

## 🔧 Integration Steps

### Step 1: Add Import to CalorieTracker.jsx

Add this import at the top (after the AiFoodSearch import):

```javascript
import AiMealPlanner from "./AiMealPlanner";
```

### Step 2: Add Component to JSX

Find the line with `<AiFoodSearch onAddFood={addAiFoodToIntake} />` (around line 1308)

Add this RIGHT AFTER it:

```jsx
{/* AI Meal Planner Component */}
<AiMealPlanner 
  user={user}
  dailyGoal={dailyGoal}
/>
```

## 🎯 Features

### Goal-Based Planning

1. **Weight Loss (20% Calorie Deficit)**
   - Reduces daily calories by 20%
   - Focuses on lean proteins, vegetables, and whole grains
   - Lower calorie meals with high satiety

2. **Weight Gain (20% Calorie Surplus)**
   - Increases daily calories by 20%
   - Includes calorie-dense foods
   - Higher protein and carb content

3. **Maintain Weight**
   - Uses your current daily goal
   - Balanced macronutrients
   - Sustainable eating patterns

### Diet Preferences

- **🍽️ Balanced:** Mix of all food groups
- **🌱 Vegetarian:** Plant-based with dairy/eggs
- **🥩 High Protein:** Emphasis on protein-rich foods

### Meal Frequency

- **3 Meals:** Breakfast, Lunch, Dinner
- **4 Meals:** Breakfast, Lunch, Snack, Dinner
- **5 Meals:** Breakfast, Morning Snack, Lunch, Evening Snack, Dinner

## 📊 How It Works

1. **User Selects Preferences:**
   - Fitness goal (loss/gain/maintain)
   - Diet type
   - Meals per day

2. **AI Generates Plan:**
   - Calculates target calories based on goal
   - Divides calories across meals
   - Searches API Ninjas for matching foods
   - Creates 7-day meal plan

3. **Display Results:**
   - Shows each day with all meals
   - Displays nutrition info per meal
   - Shows daily calorie totals
   - Provides meal timing suggestions

## 🎨 UI Features

- **Gradient Design:** Orange/amber theme matching your app
- **Animated Cards:** Smooth transitions and hover effects
- **Responsive Layout:** Works on all screen sizes
- **Loading States:** Shows progress while generating
- **Toast Notifications:** Success/error feedback

## 📋 Example Output

```
Monday - Total: 1600 cal
├─ Breakfast (8:00 AM) - Oatmeal - 350 cal
│  💪 12g protein | 🍞 58g carbs | 🥑 6g fat
├─ Lunch (1:00 PM) - Grilled Chicken Salad - 450 cal
│  💪 35g protein | 🍞 25g carbs | 🥑 18g fat
└─ Dinner (7:00 PM) - Grilled Fish - 400 cal
   💪 40g protein | 🍞 15g carbs | 🥑 12g fat
```

## 🚀 Usage Instructions

1. **Navigate to Calorie Tracker**
2. **Scroll to "AI-Powered Smart Meal Planner"**
3. **Select Your Preferences:**
   - Choose fitness goal
   - Select diet type
   - Pick meals per day
4. **Click "Generate 7-Day Meal Plan"**
5. **Wait 30-60 seconds** (fetching data for 21-35 meals)
6. **View Your Plan:**
   - See all 7 days
   - Check nutrition details
   - Copy or clear as needed

## ⚠️ Important Notes

### API Rate Limiting
- The planner makes multiple API calls (one per meal)
- There's a 300ms delay between calls to avoid rate limits
- Generation takes 30-60 seconds for a full week
- If you hit rate limits, wait a few minutes before regenerating

### Best Practices
1. **Generate Once:** Don't spam the generate button
2. **Wait for Completion:** Let it finish before regenerating
3. **Copy Your Plan:** Save it before clearing
4. **Adjust as Needed:** Use as a guide, not strict rules

## 🔧 Customization Options

You can modify the meal queries in the component:
- Add more food options
- Change meal timing
- Adjust calorie calculations
- Add more diet types (vegan, keto, etc.)

## 📱 Mobile Responsive

The component is fully responsive:
- Stacks on mobile devices
- Touch-friendly buttons
- Readable on small screens
- Smooth scrolling

## 🎯 Integration Example

```jsx
// In CalorieTracker.jsx

import AiMealPlanner from "./AiMealPlanner";

// ... in the JSX return statement ...

<AiFoodSearch onAddFood={addAiFoodToIntake} />

{/* AI Meal Planner Component */}
<AiMealPlanner 
  user={user}
  dailyGoal={dailyGoal}
/>

{/* Today's Meal Log Section */}
<motion.div ref={mealLogRef}>
  ...
</motion.div>
```

## ✅ Testing

1. Set your daily calorie goal
2. Generate a weight loss plan
3. Check that calories are ~20% less than goal
4. Verify all 7 days have meals
5. Check nutrition info displays correctly
6. Test copy and clear buttons

## 🆘 Troubleshooting

**Problem:** Plan generation fails
- **Solution:** Check API key in config.js
- **Solution:** Wait if you hit rate limits

**Problem:** Some days missing meals
- **Solution:** API might not have data for some queries
- **Solution:** Regenerate the plan

**Problem:** Calories don't match goal
- **Solution:** This is normal - it's based on available foods
- **Solution:** Use as a guide, adjust portions as needed

## 🎉 You're Done!

Your AI meal planner is ready to help users achieve their fitness goals with personalized weekly meal plans!
