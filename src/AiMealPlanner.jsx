import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_CONFIG } from "./config";

const AiMealPlanner = ({ user, dailyGoal, onAddMealPlan }) => {
  const [goal, setGoal] = useState("weight_loss"); // weight_loss, weight_gain, maintain
  const [dietType, setDietType] = useState("balanced"); // balanced, vegetarian, vegan, keto, high_protein
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [loading, setLoading] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Calculate target calories based on goal
  const calculateTargetCalories = () => {
    const baseCalories = dailyGoal || 2000;
    switch (goal) {
      case "weight_loss":
        return Math.round(baseCalories * 0.8); // 20% deficit
      case "weight_gain":
        return Math.round(baseCalories * 1.2); // 20% surplus
      case "maintain":
        return baseCalories;
      default:
        return baseCalories;
    }
  };

  // Generate meal plan using AI
  const generateMealPlan = async () => {
    setLoading(true);
    const targetCalories = calculateTargetCalories();
    const caloriesPerMeal = Math.round(targetCalories / mealsPerDay);

    console.log('🍽️ Generating meal plan:', {
      goal,
      dietType,
      targetCalories,
      mealsPerDay,
      caloriesPerMeal
    });

    try {
      // Generate meals for 7 days
      const weekPlan = {};
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      for (const day of days) {
        const dayMeals = [];
        
        // Generate meals based on diet type and goal
        const mealTypes = getMealTypes(mealsPerDay);
        
        for (let i = 0; i < mealTypes.length; i++) {
          const mealType = mealTypes[i];
          const foodQuery = getMealQuery(dietType, goal, mealType);
          
          try {
            // Search for food using API Ninjas
            const response = await axios.get(API_CONFIG.NINJAS_API_URL, {
              params: { query: foodQuery },
              headers: {
                'X-Api-Key': API_CONFIG.NINJAS_API_KEY
              }
            });

            if (response.data && response.data.length > 0) {
              // Pick the best match based on calories
              const bestMatch = findBestCalorieMatch(response.data, caloriesPerMeal);
              
              dayMeals.push({
                id: `${day}_${mealType}_${Date.now()}`,
                type: mealType,
                name: bestMatch.name,
                calories: Math.round(bestMatch.calories),
                protein: Math.round(bestMatch.protein_g),
                carbs: Math.round(bestMatch.carbohydrates_total_g),
                fat: Math.round(bestMatch.fat_total_g),
                serving: `${bestMatch.serving_size_g}g`,
                time: getMealTime(mealType)
              });
            }
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.error(`Error fetching meal for ${day} - ${mealType}:`, error);
          }
        }
        
        weekPlan[day] = dayMeals;
      }

      setWeeklyPlan(weekPlan);
      setToastMessage(`✅ Generated ${Object.keys(weekPlan).length}-day meal plan!`);
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      console.log('✅ Meal plan generated:', weekPlan);
    } catch (error) {
      console.error('❌ Error generating meal plan:', error);
      setToastMessage("Failed to generate meal plan. Please try again.");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get meal types based on meals per day
  const getMealTypes = (count) => {
    if (count === 3) return ['Breakfast', 'Lunch', 'Dinner'];
    if (count === 4) return ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
    if (count === 5) return ['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];
    return ['Breakfast', 'Lunch', 'Dinner'];
  };

  // Helper function to get meal time
  const getMealTime = (mealType) => {
    const times = {
      'Breakfast': '8:00 AM',
      'Morning Snack': '10:30 AM',
      'Lunch': '1:00 PM',
      'Snack': '4:00 PM',
      'Evening Snack': '4:00 PM',
      'Dinner': '7:00 PM'
    };
    return times[mealType] || '12:00 PM';
  };

  // Helper function to get meal query based on diet and goal
  const getMealQuery = (diet, goalType, mealType) => {
    const queries = {
      weight_loss: {
        balanced: {
          Breakfast: ['oatmeal', 'greek yogurt', 'egg white omelet', 'fruit salad'],
          Lunch: ['grilled chicken salad', 'quinoa bowl', 'vegetable soup', 'tuna salad'],
          Dinner: ['grilled fish', 'chicken breast', 'turkey', 'tofu stir fry'],
          Snack: ['apple', 'almonds', 'carrot sticks', 'cucumber'],
          'Morning Snack': ['banana', 'berries', 'low fat yogurt'],
          'Evening Snack': ['celery', 'cherry tomatoes', 'protein shake']
        },
        vegetarian: {
          Breakfast: ['oatmeal', 'greek yogurt', 'vegetable omelet', 'smoothie bowl'],
          Lunch: ['lentil soup', 'quinoa salad', 'vegetable curry', 'chickpea salad'],
          Dinner: ['tofu stir fry', 'vegetable pasta', 'bean burrito', 'paneer tikka'],
          Snack: ['apple', 'almonds', 'hummus', 'fruit'],
          'Morning Snack': ['banana', 'nuts', 'yogurt'],
          'Evening Snack': ['vegetables', 'fruit', 'seeds']
        },
        high_protein: {
          Breakfast: ['egg white omelet', 'protein shake', 'cottage cheese', 'greek yogurt'],
          Lunch: ['grilled chicken', 'tuna', 'turkey breast', 'salmon'],
          Dinner: ['lean beef', 'chicken breast', 'fish', 'shrimp'],
          Snack: ['protein bar', 'almonds', 'hard boiled egg'],
          'Morning Snack': ['protein shake', 'cottage cheese'],
          'Evening Snack': ['tuna', 'chicken strips']
        }
      },
      weight_gain: {
        balanced: {
          Breakfast: ['oatmeal with nuts', 'whole eggs', 'pancakes', 'bagel with peanut butter'],
          Lunch: ['chicken rice bowl', 'pasta', 'burger', 'burrito'],
          Dinner: ['steak', 'salmon', 'chicken thighs', 'pork chop'],
          Snack: ['peanut butter', 'trail mix', 'protein shake', 'granola'],
          'Morning Snack': ['banana with peanut butter', 'protein bar'],
          'Evening Snack': ['nuts', 'cheese', 'protein shake']
        },
        vegetarian: {
          Breakfast: ['oatmeal with nuts', 'whole grain toast', 'smoothie', 'granola'],
          Lunch: ['pasta', 'rice and beans', 'quinoa bowl', 'veggie burger'],
          Dinner: ['tofu curry', 'paneer butter masala', 'bean burrito', 'vegetable pasta'],
          Snack: ['peanut butter', 'nuts', 'avocado', 'hummus'],
          'Morning Snack': ['smoothie', 'granola bar'],
          'Evening Snack': ['nuts', 'seeds', 'dried fruit']
        },
        high_protein: {
          Breakfast: ['whole eggs', 'protein pancakes', 'steak and eggs', 'protein shake'],
          Lunch: ['chicken breast', 'salmon', 'beef', 'turkey'],
          Dinner: ['ribeye steak', 'chicken thighs', 'pork chop', 'lamb'],
          Snack: ['protein shake', 'beef jerky', 'cottage cheese', 'greek yogurt'],
          'Morning Snack': ['protein bar', 'eggs'],
          'Evening Snack': ['protein shake', 'tuna']
        }
      },
      maintain: {
        balanced: {
          Breakfast: ['oatmeal', 'eggs', 'toast', 'cereal'],
          Lunch: ['chicken salad', 'sandwich', 'rice bowl', 'pasta'],
          Dinner: ['grilled chicken', 'fish', 'beef', 'tofu'],
          Snack: ['fruit', 'nuts', 'yogurt', 'vegetables'],
          'Morning Snack': ['banana', 'apple'],
          'Evening Snack': ['carrots', 'almonds']
        }
      }
    };

    const goalQueries = queries[goalType] || queries.maintain;
    const dietQueries = goalQueries[diet] || goalQueries.balanced;
    const mealQueries = dietQueries[mealType] || dietQueries.Breakfast;
    
    // Randomly select a query from the array
    return mealQueries[Math.floor(Math.random() * mealQueries.length)];
  };

  // Find best calorie match
  const findBestCalorieMatch = (foods, targetCalories) => {
    return foods.reduce((best, current) => {
      const bestDiff = Math.abs(best.calories - targetCalories);
      const currentDiff = Math.abs(current.calories - targetCalories);
      return currentDiff < bestDiff ? current : best;
    });
  };

  // Calculate total calories for a day
  const getDayTotalCalories = (meals) => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderRadius: "25px",
        padding: "30px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
        marginBottom: "30px",
      }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              background: toastType === "error"
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              padding: "16px 24px",
              borderRadius: "15px",
              fontWeight: "600",
              boxShadow: `0 0 25px ${toastType === "error"
                ? "rgba(239, 68, 68, 0.5)"
                : "rgba(16, 185, 129, 0.5)"}`,
              zIndex: 9999,
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginBottom: "25px" }}>
        <h2 style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 15px 0"
        }}>
          🎯 AI-Powered Smart Meal Planner
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "25px" }}>
          Generate a personalized 7-day meal plan based on your fitness goals
        </p>

        {/* Configuration Options */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "25px"
        }}>
          {/* Goal Selection */}
          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "10px"
            }}>
              🎯 Fitness Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "12px",
                border: "2px solid rgba(245, 158, 11, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <option value="weight_loss" style={{ background: "#1e293b", color: "#fff" }}>
                🔥 Weight Loss (20% deficit)
              </option>
              <option value="maintain" style={{ background: "#1e293b", color: "#fff" }}>
                ⚖️ Maintain Weight
              </option>
              <option value="weight_gain" style={{ background: "#1e293b", color: "#fff" }}>
                💪 Weight Gain (20% surplus)
              </option>
            </select>
          </div>

          {/* Diet Type */}
          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "10px"
            }}>
              🥗 Diet Preference
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "12px",
                border: "2px solid rgba(245, 158, 11, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <option value="balanced" style={{ background: "#1e293b", color: "#fff" }}>
                🍽️ Balanced
              </option>
              <option value="vegetarian" style={{ background: "#1e293b", color: "#fff" }}>
                🌱 Vegetarian
              </option>
              <option value="high_protein" style={{ background: "#1e293b", color: "#fff" }}>
                🥩 High Protein
              </option>
            </select>
          </div>

          {/* Meals Per Day */}
          <div>
            <label style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "10px"
            }}>
              🍴 Meals Per Day
            </label>
            <select
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "12px",
                border: "2px solid rgba(245, 158, 11, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <option value="3" style={{ background: "#1e293b", color: "#fff" }}>3 Meals</option>
              <option value="4" style={{ background: "#1e293b", color: "#fff" }}>4 Meals</option>
              <option value="5" style={{ background: "#1e293b", color: "#fff" }}>5 Meals</option>
            </select>
          </div>
        </div>

        {/* Target Calories Display */}
        <div style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px" }}>Target Daily Calories</div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#f59e0b" }}>
                {calculateTargetCalories()} cal
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px" }}>Per Meal</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#cbd5e1" }}>
                ~{Math.round(calculateTargetCalories() / mealsPerDay)} cal
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateMealPlan}
          disabled={loading}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "15px",
            border: "none",
            background: loading
              ? "rgba(245, 158, 11, 0.5)"
              : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#fff",
            fontWeight: "700",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "🔄 Generating Your Meal Plan..." : "✨ Generate 7-Day Meal Plan"}
        </motion.button>
      </div>

      {/* Weekly Meal Plan Display */}
      {weeklyPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={{
            fontSize: "1.4rem",
            fontWeight: "700",
            color: "#cbd5e1",
            marginBottom: "20px",
            borderBottom: "2px solid rgba(245, 158, 11, 0.3)",
            paddingBottom: "10px"
          }}>
            📅 Your 7-Day Meal Plan
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {Object.entries(weeklyPlan).map(([day, meals], dayIndex) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "18px",
                  padding: "20px",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  flexWrap: "wrap",
                  gap: "10px"
                }}>
                  <h4 style={{
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#f59e0b",
                    margin: 0
                  }}>
                    {day}
                  </h4>
                  <div style={{
                    background: "rgba(245, 158, 11, 0.2)",
                    padding: "6px 15px",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#fbbf24"
                  }}>
                    Total: {getDayTotalCalories(meals)} cal
                  </div>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "12px"
                }}>
                  {meals.map((meal, mealIndex) => (
                    <motion.div
                      key={meal.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                        borderRadius: "12px",
                        padding: "15px",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "10px"
                      }}>
                        <div>
                          <div style={{
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                            marginBottom: "4px"
                          }}>
                            {meal.type} • {meal.time}
                          </div>
                          <div style={{
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: "#fff"
                          }}>
                            {meal.name}
                          </div>
                        </div>
                        <div style={{
                          background: "linear-gradient(135deg, #f59e0b, #d97706)",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          color: "#fff"
                        }}>
                          {meal.calories} cal
                        </div>
                      </div>

                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "6px",
                        fontSize: "0.75rem"
                      }}>
                        <div style={{ color: "#3b82f6" }}>
                          💪 {meal.protein}g protein
                        </div>
                        <div style={{ color: "#f59e0b" }}>
                          🍞 {meal.carbs}g carbs
                        </div>
                        <div style={{ color: "#ef4444" }}>
                          🥑 {meal.fat}g fat
                        </div>
                      </div>

                      <div style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginTop: "8px"
                      }}>
                        📏 Serving: {meal.serving}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "15px",
            marginTop: "25px",
            flexWrap: "wrap"
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const planText = JSON.stringify(weeklyPlan, null, 2);
                navigator.clipboard.writeText(planText);
                setToastMessage("📋 Meal plan copied to clipboard!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "14px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(59, 130, 246, 0.5)",
                background: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              📋 Copy Plan
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setWeeklyPlan(null);
                setToastMessage("Meal plan cleared. Generate a new one!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "14px 20px",
                borderRadius: "12px",
                border: "2px solid rgba(239, 68, 68, 0.5)",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              🗑️ Clear Plan
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#f59e0b",
            fontSize: "1rem"
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(245, 158, 11, 0.2)",
              borderTop: "4px solid #f59e0b",
              borderRadius: "50%",
              margin: "0 auto 15px"
            }}
          />
          <div>Generating your personalized meal plan...</div>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "10px" }}>
            This may take a minute as we fetch nutritional data
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AiMealPlanner;
