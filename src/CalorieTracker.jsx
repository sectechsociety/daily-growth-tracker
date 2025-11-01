import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabaseClient";
import axios from "axios";
import { getAllIndianFoods, getFoodsByCategory, searchFoods } from "./indianFoodData";
import { API_CONFIG } from "./config";
import AiMealPlanner from "./AiMealPlanner";
import AiFoodSearch from "./AiFoodSearch";
const CalorieTracker = ({ user, addXP, userStats, setUserStats }) => {
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealCategory, setMealCategory] = useState("breakfast");
  const [confirmReset, setConfirmReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [todayMealLog, setTodayMealLog] = useState([]);

  // New Food Recommendation States
  const [activeFoodCategory, setActiveFoodCategory] = useState("balanced");
  const [foodSearch, setFoodSearch] = useState("");
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  
  // AI Food Search States
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [aiSearchResults, setAiSearchResults] = useState([]);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [showAiSearch, setShowAiSearch] = useState(false);

  // Ref for meal log section
  const mealLogRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  // Helper function for authenticated requests
  const makeAuthenticatedRequest = async (url, data = null, method = 'GET') => {
    try {
      const config = {
        method,
        url: `${API_URL}${url}`,
        headers: { userid: user?.id || 'demo-user' }
      };
      if (data) config.data = data;
      const response = await axios(config);
      return response;
    } catch (error) {
      console.error(`API request failed: ${method} ${url}`, error.message);
      throw error; // Re-throw to let calling functions handle fallback
    }
  };

  // Load today's calorie data from backend
  useEffect(() => {
    if (user?.id) {
      loadTodayData();
    } else {
      // No user, use localStorage only
      loadFromLocalStorage();
      setLoading(false);
    }
  }, [user?.id]);

  // Also load localStorage on initial mount (for offline mode)
  useEffect(() => {
    if (!user?.id && !loading) {
      loadFromLocalStorage();
    }
  }, []); // Empty dependency array for initial mount only

  const loadTodayData = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest('/calories/today');
      const data = response.data;

      setCaloriesConsumed(data.totalCalories || 0);
      setDailyGoal(data.dailyGoal || 2000);
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Error loading calorie data from backend:', error);
      console.log('Falling back to localStorage...');
      // Fallback to localStorage for offline mode
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedCalories = localStorage.getItem("caloriesConsumed");
      const savedGoal = localStorage.getItem("dailyCalorieGoal");
      const savedMeals = localStorage.getItem("calorieMeals");
      const savedMealLog = localStorage.getItem("todayMealLog");

      setCaloriesConsumed(savedCalories ? parseInt(savedCalories) : 0);
      setDailyGoal(savedGoal ? parseInt(savedGoal) : 2000);

      if (savedMeals) {
        try {
          const mealsData = JSON.parse(savedMeals);
          setMeals(Array.isArray(mealsData) ? mealsData : []);
        } catch (parseError) {
          console.error('Error parsing saved meals:', parseError);
          setMeals([]);
        }
      } else {
        setMeals([]);
      }

      if (savedMealLog) {
        try {
          const mealLogData = JSON.parse(savedMealLog);
          setTodayMealLog(Array.isArray(mealLogData) ? mealLogData : []);
        } catch (parseError) {
          console.error('Error parsing saved meal log:', parseError);
          setTodayMealLog([]);
        }
      } else {
        setTodayMealLog([]);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Reset to defaults if there's any issue
      setCaloriesConsumed(0);
      setDailyGoal(2000);
      setMeals([]);
      setTodayMealLog([]);
    }
  };

  const addMeal = async () => {
    if (!mealName.trim() || !mealCalories || isNaN(mealCalories)) return;

    const calories = parseInt(mealCalories);

    try {
      const response = await makeAuthenticatedRequest('/calories/add-meal', {
        name: mealName,
        calories,
        category: mealCategory,
      }, 'POST');

      if (response.data.success) {
        setCaloriesConsumed(response.data.calorieEntry.totalCalories);
        setMeals(response.data.calorieEntry.meals);

        // Show success toast with XP gained
        setToastMessage("Meal Added Successfully! +5 XP Gained!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Reset form
        setMealName("");
        setMealCalories("");
        setMealCategory("breakfast");
        setShowAddMealModal(false);
      }
    } catch (error) {
      console.error('Error adding meal to backend:', error);
      // Fallback to localStorage for offline mode
      const newCalories = caloriesConsumed + calories;
      setCaloriesConsumed(newCalories);

      // Save to localStorage
      localStorage.setItem("caloriesConsumed", newCalories.toString());
      localStorage.setItem("calorieMeals", JSON.stringify([...meals, {
        id: Date.now(),
        name: mealName,
        calories,
        category: mealCategory,
        timestamp: new Date().toISOString()
      }]));

      // Add to today's meal log
      const mealLogItem = {
        id: `meal_${Date.now()}`,
        name: mealName,
        calories,
        protein: 0, // Custom meals don't have detailed macros
        carbs: 0,
        fat: 0,
        category: mealCategory,
        timestamp: new Date().toISOString(),
        source: 'custom_meal'
      };
      setTodayMealLog(prev => [...prev, mealLogItem]);
      localStorage.setItem("todayMealLog", JSON.stringify([...todayMealLog, mealLogItem]));

      // Show success toast
      setToastMessage("Meal added locally! (Offline mode)");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Reset form
      setMealName("");
      setMealCalories("");
      setMealCategory("breakfast");
      setShowAddMealModal(false);
    }
  };

  const addFoodToIntake = async (food) => {
    try {
      const newCalories = caloriesConsumed + food.calories;

      // Check if user reached or exceeded goal
      const reachedGoal = newCalories >= dailyGoal;
      const exceededGoal = newCalories > dailyGoal;

      // Update calories
      setCaloriesConsumed(newCalories);

      // Add XP for logging food (5 XP per food item)
      if (addXP) {
        addXP(`food_${food.id}`, 5);
      }

      // Update user stats if provided
      if (setUserStats) {
        setUserStats(prev => ({
          ...prev,
          xp: prev.xp + 5,
          tasksCompleted: prev.tasksCompleted + 1
        }));
      }

      // Save to Supabase
      await saveFoodLogToSupabase(food);

      // Update leaderboard in Supabase
      if (user?.id && userStats) {
        const currentLevel = userStats.level;
        const currentXp = userStats.xp + 5;
        const newLevel = Math.floor(currentXp / 100) + 1;

        await updateUserLevelInSupabase(currentXp, newLevel);

        // Update leaderboard
        try {
          await supabase
            .from('leaderboard')
            .upsert({
              user_id: user.id,
              email: user.email,
              username: user.name || user.email?.split('@')[0] || 'User',
              xp: currentXp,
              level: newLevel,
              last_updated: new Date().toISOString()
            });
        } catch (error) {
          console.error('Error updating leaderboard:', error);
        }
      }

      // Show appropriate toast message
      if (reachedGoal) {
        setToastMessage(exceededGoal
          ? "You're slightly above your goal — stay mindful! 🌱"
          : "Great job! You reached your goal today! 💪🔥");
        setToastType(exceededGoal ? "warning" : "success");
      } else {
        setToastMessage(`Added ${food.name}! +5 XP gained!`);
        setToastType("success");
      }

      // Add to today's meal log
      const mealLogItem = {
        id: `food_${food.id}_${Date.now()}`,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        category: activeFoodCategory,
        timestamp: new Date().toISOString(),
        source: 'food_recommendation'
      };
      setTodayMealLog(prev => [...prev, mealLogItem]);
      localStorage.setItem("todayMealLog", JSON.stringify([...todayMealLog, mealLogItem]));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);

      // Close modal
      setShowFoodModal(false);
      setSelectedFood(null);

    } catch (error) {
      console.error('Error adding food:', error);

      // Fallback to localStorage for offline mode
      const newCalories = caloriesConsumed + food.calories;
      setCaloriesConsumed(newCalories);

      // Save to localStorage
      localStorage.setItem("caloriesConsumed", newCalories.toString());
      localStorage.setItem("calorieMeals", JSON.stringify([...meals, {
        id: `food_${food.id}_${Date.now()}`,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        category: activeFoodCategory,
        timestamp: new Date().toISOString()
      }]));

      // Show error toast
      setToastMessage("Added food locally! (Offline mode)");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Add to today's meal log (offline mode)
      const mealLogItem = {
        id: `food_${food.id}_${Date.now()}`,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        category: activeFoodCategory,
        timestamp: new Date().toISOString(),
        source: 'food_recommendation'
      };
      setTodayMealLog(prev => [...prev, mealLogItem]);
      localStorage.setItem("todayMealLog", JSON.stringify([...todayMealLog, mealLogItem]));

      // Close modal
      setShowFoodModal(false);
      setSelectedFood(null);
    }
  };

  // Function to scroll to meal log section
  const handleViewLog = () => {
    if (mealLogRef.current) {
      mealLogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 2000);
    } else {
      try {
        await makeAuthenticatedRequest('/calories/reset', {}, 'POST');
        setCaloriesConsumed(0);
        setMeals([]);
        setTodayMealLog([]);
        // Clear localStorage
        localStorage.removeItem("caloriesConsumed");
        localStorage.removeItem("calorieMeals");
        localStorage.removeItem("todayMealLog");
        setConfirmReset(false);
      } catch (error) {
        console.error('Error resetting calories on backend:', error);
        // Fallback to local behavior
        setCaloriesConsumed(0);
        setMeals([]);
        setTodayMealLog([]);
        localStorage.removeItem("caloriesConsumed");
        localStorage.removeItem("calorieMeals");
        localStorage.removeItem("todayMealLog");
        setConfirmReset(false);
      }
    }
  };

  const updateGoal = async (newGoal) => {
    if (newGoal > 0) {
      try {
        await makeAuthenticatedRequest('/calories/goal', {
          dailyGoal: newGoal,
        }, 'PUT');
        setDailyGoal(newGoal);
        // Save to localStorage as backup
        localStorage.setItem("dailyCalorieGoal", newGoal.toString());
      } catch (error) {
        console.error('Error updating calorie goal on backend:', error);
        // Fallback to local behavior
        setDailyGoal(newGoal);
        localStorage.setItem("dailyCalorieGoal", newGoal.toString());
      }
    }
  };

  // Supabase integration functions
  const saveFoodLogToSupabase = async (food) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          food_name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          category: activeFoodCategory,
          benefits: food.benefits,
          logged_at: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error saving food log to Supabase:', error);
      }
    } catch (error) {
      console.error('Error in saveFoodLogToSupabase:', error);
    }
  };

  const updateUserLevelInSupabase = async (newXp, newLevel) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          xp: newXp,
          level: newLevel,
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating user level in Supabase:', error);
      }
    } catch (error) {
      console.error('Error in updateUserLevelInSupabase:', error);
    }
  };

  // Get all Indian foods from the database
  const getAllFoods = useMemo(() => {
    return getAllIndianFoods();
  }, []);

  // Map activeFoodCategory to the corresponding category in the database
  const getMappedCategory = (category) => {
    switch (category) {
      case 'fat_loss':
        return 'fat_loss';
      case 'muscle_gain':
        return 'muscle_gain';
      case 'balanced':
        return 'balanced';
      default:
        return 'balanced';
    }
  };

  // Filter foods based on search and category
  const getFilteredFoods = () => {
    // Get foods by category first
    const category = getMappedCategory(activeFoodCategory);
    let foods = getFoodsByCategory(category);
    
    // If there's a search term, filter by that
    if (foodSearch.trim()) {
      const searchResults = searchFoods(foodSearch.trim().toLowerCase());
      // Filter to only include foods from the current category
      foods = searchResults.filter(food => 
        getMappedCategory(food.category) === category
      );
    }
    
    return foods;
  };

  // AI-Powered Food Search using API Ninjas
  const searchFoodWithAI = async (query) => {
    if (!query.trim()) {
      setToastMessage("Please enter a food name to search");
      setToastType("warning");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setAiSearchLoading(true);
    try {
      const response = await axios.get(API_CONFIG.NINJAS_API_URL, {
        params: { query: query },
        headers: {
          'X-Api-Key': API_CONFIG.NINJAS_API_KEY
        }
      });

      if (response.data && response.data.length > 0) {
        // Transform API response to match our food format
        const transformedResults = response.data.map((item, index) => ({
          id: `ai_${Date.now()}_${index}`,
          name: item.name,
          calories: Math.round(item.calories),
          protein: Math.round(item.protein_g),
          carbs: Math.round(item.carbohydrates_total_g),
          fat: Math.round(item.fat_total_g),
          fiber: Math.round(item.fiber_g || 0),
          sugar: Math.round(item.sugar_g || 0),
          serving: `${item.serving_size_g}g`,
          category: 'balanced',
          source: 'api_ninjas'
        }));

        setAiSearchResults(transformedResults);
        setToastMessage(`Found ${transformedResults.length} results!`);
        setToastType("success");
      } else {
        setAiSearchResults([]);
        setToastMessage("No results found. Try a different search term.");
        setToastType("warning");
      }
    } catch (error) {
      console.error('Error searching food with AI:', error);
      setToastMessage("Failed to search. Please try again.");
      setToastType("error");
      setAiSearchResults([]);
    } finally {
      setAiSearchLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
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

        // Close modal
        setShowFoodModal(false);
        setSelectedFood(null);
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

  // Safe calculations with defaults
  const safeDailyGoal = dailyGoal || 2000;
  const safeCaloriesConsumed = caloriesConsumed || 0;
  const caloriesRemaining = Math.max(0, safeDailyGoal - safeCaloriesConsumed);
  const progressPercentage = safeDailyGoal > 0 ? Math.min((safeCaloriesConsumed / safeDailyGoal) * 100, 100) : 0;
  const isOverGoal = safeDailyGoal > 0 && safeCaloriesConsumed > safeDailyGoal;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.1)",
            borderTop: "4px solid #10b981",
            borderRadius: "50%",
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        position: "relative",
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
              background: toastType === "warning"
                ? "linear-gradient(135deg, #f59e0b, #d97706)"
                : toastType === "error"
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              padding: "16px 24px",
              borderRadius: "15px",
              fontWeight: "600",
              boxShadow: `0 0 25px ${toastType === "warning"
                ? "rgba(245, 158, 11, 0.5)"
                : toastType === "error"
                ? "rgba(239, 68, 68, 0.5)"
                : "rgba(16, 185, 129, 0.5)"}`,
              zIndex: 1500,
              border: `1px solid ${toastType === "warning"
                ? "rgba(245, 158, 11, 0.3)"
                : toastType === "error"
                ? "rgba(239, 68, 68, 0.3)"
                : "rgba(16, 185, 129, 0.3)"}`,
            }}
          >
            {toastType === "success" ? "✅" : toastType === "warning" ? "⚠️" : "❌"} {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{
          rotateX: 2,
          rotateY: -2,
          transition: { type: "spring", stiffness: 150 },
        }}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {/* Progress Circle */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "180px",
                height: "180px",
                position: "relative",
                background: `conic-gradient(${
                  isOverGoal ? "#ef4444" : "#10b981"
                } ${progressPercentage * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 30px ${
                  isOverGoal
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(16, 185, 129, 0.3)"
                }`,
              }}
            >
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  background: "rgba(15, 23, 42, 0.8)",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: isOverGoal ? "#ef4444" : "#10b981",
                  }}
                >
                  {Math.round(progressPercentage)}%
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  Complete
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <motion.input
                type="number"
                value={safeDailyGoal}
                onChange={(e) => updateGoal(parseInt(e.target.value))}
                whileFocus={{ scale: 1.05 }}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f59e0b",
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  textAlign: "center",
                }}
              />
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Daily Goal
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  color: isOverGoal ? "#ef4444" : "#3b82f6",
                }}
              >
                {safeCaloriesConsumed}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Consumed
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                border: `1px solid ${
                  caloriesRemaining < 0
                    ? "rgba(239,68,68,0.3)"
                    : "rgba(16,185,129,0.3)"
                }`,
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  color: caloriesRemaining < 0 ? "#ef4444" : "#10b981",
                }}
              >
                {caloriesRemaining > 0 ? caloriesRemaining : 0}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Remaining
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Add Meal Button */}
            <motion.button
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px rgba(34,197,94,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddMealModal(true)}
              style={{
                padding: "15px 25px",
                borderRadius: "15px",
                border: "none",
                background: "linear-gradient(135deg,#10b981,#059669)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.span
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)",
                }}
              />
              <span style={{ position: "relative", zIndex: 2 }}>➕ Add Meal</span>
            </motion.button>

            {/* View Meal Log Button */}
            <motion.button
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px rgba(59,130,246,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewLog}
              style={{
                padding: "15px 25px",
                borderRadius: "15px",
                border: "none",
                background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.span
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)",
                }}
              />
              <span style={{ position: "relative", zIndex: 2 }}>📋 View Meal Log</span>
            </motion.button>

            {/* Reset Button */}
            <motion.button
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px rgba(239,68,68,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              style={{
                padding: "15px 25px",
                borderRadius: "15px",
                border: "none",
                background: "linear-gradient(135deg,#ef4444,#dc2626)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {confirmReset ? "❗ Click Again to Confirm" : "🔄 Reset"}
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              width: "100%",
              height: "12px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${
                  isOverGoal ? "#ef4444" : "#10b981"
                }, ${isOverGoal ? "#dc2626" : "#059669"})`,
                borderRadius: "6px",
                boxShadow: `0 0 20px ${
                  isOverGoal
                    ? "rgba(239,68,68,0.5)"
                    : "rgba(16,185,129,0.5)"
                }`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              fontSize: "0.9rem",
              color: "#64748b",
            }}
          >
            <span>Progress</span>
            <span
              style={{
                color: isOverGoal ? "#ef4444" : "#10b981",
                fontWeight: "600",
              }}
            >
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>
      </motion.div>

      {/* Food Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
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
        <div style={{ marginBottom: "25px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0
            }}>
              🥗 AI Food Recommendations
            </h2>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { key: "fat_loss", label: "🔥 Fat Loss", color: "#ef4444" },
                { key: "muscle_gain", label: "💪 Muscle Gain", color: "#10b981" },
                { key: "balanced", label: "🍏 Healthy", color: "#3b82f6" }
              ].map((category) => (
                <motion.button
                  key={category.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFoodCategory(category.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "none",
                    background: activeFoodCategory === category.key
                      ? `linear-gradient(135deg, ${category.color}, ${category.color}cc)`
                      : "rgba(255, 255, 255, 0.1)",
                    color: activeFoodCategory === category.key ? "#fff" : "#cbd5e1",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: activeFoodCategory === category.key
                      ? `0 0 15px ${category.color}40`
                      : "none",
                  }}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{
            position: "relative",
            marginBottom: "20px",
            maxWidth: "400px"
          }}>
            <input
              type="text"
              placeholder="Search foods or benefits..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 45px",
                borderRadius: "15px",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(59, 130, 246, 0.6)";
                e.target.style.boxShadow = "0 0 15px rgba(59, 130, 246, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(59, 130, 246, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
            <div style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              fontSize: "1.1rem"
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Food Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          <AnimatePresence mode="wait">
            {getFilteredFoods().map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  y: -8,
                  boxShadow: `0 15px 40px ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                    activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}30`
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "20px",
                  padding: "20px",
                  border: `2px solid ${activeFoodCategory === 'fat_loss' ? 'rgba(239, 68, 68, 0.2)' :
                    activeFoodCategory === 'muscle_gain' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  setSelectedFood(food);
                  setShowFoodModal(true);
                }}
              >
                {/* Food Icon Background */}
                <div style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "60px",
                  height: "60px",
                  background: `linear-gradient(135deg, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                    activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}20, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                    activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}10)`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  border: `2px solid ${activeFoodCategory === 'fat_loss' ? 'rgba(239, 68, 68, 0.3)' :
                    activeFoodCategory === 'muscle_gain' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                }}>
                  {activeFoodCategory === 'fat_loss' ? '🥗' : activeFoodCategory === 'muscle_gain' ? '💪' : '🍎'}
                </div>

                {/* Food Details */}
                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#fff",
                    margin: "0 0 8px 0",
                    lineHeight: "1.2"
                  }}>
                    {food.name}
                  </h3>

                  {/* Macronutrients */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                    marginBottom: "15px"
                  }}>
                    <div style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      padding: "8px",
                      borderRadius: "10px",
                      textAlign: "center",
                      border: "1px solid rgba(59, 130, 246, 0.2)"
                    }}>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600" }}>Protein</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#3b82f6" }}>{food.protein}g</div>
                    </div>
                    <div style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      padding: "8px",
                      borderRadius: "10px",
                      textAlign: "center",
                      border: "1px solid rgba(16, 185, 129, 0.2)"
                    }}>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600" }}>Carbs</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#10b981" }}>{food.carbs}g</div>
                    </div>
                    <div style={{
                      background: "rgba(245, 158, 11, 0.1)",
                      padding: "8px",
                      borderRadius: "10px",
                      textAlign: "center",
                      border: "1px solid rgba(245, 158, 11, 0.2)"
                    }}>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600" }}>Fat</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#f59e0b" }}>{food.fat}g</div>
                    </div>
                  </div>

                  {/* Calories */}
                  <div style={{
                    background: `linear-gradient(135deg, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                      activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                      activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}cc)`,
                    padding: "10px 15px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "15px"
                  }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff" }}>
                      {food.calories} cal
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>
                      per serving
                    </div>
                  </div>

                  {/* Health Benefits */}
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600", marginBottom: "8px" }}>
                      💡 Health Benefits:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {food.benefits.slice(0, 2).map((benefit, idx) => (
                        <div key={idx} style={{
                          fontSize: "0.8rem",
                          color: "#cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          <span style={{ color: "#10b981" }}>•</span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add to Intake Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addFoodToIntake(food);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    border: "none",
                    background: `linear-gradient(135deg, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                      activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}, ${activeFoodCategory === 'fat_loss' ? '#dc2626' :
                      activeFoodCategory === 'muscle_gain' ? '#059669' : '#2563eb'})`,
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: `0 4px 15px ${activeFoodCategory === 'fat_loss' ? 'rgba(239, 68, 68, 0.3)' :
                      activeFoodCategory === 'muscle_gain' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <span>➕</span>
                  Add to Daily Intake
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {getFilteredFoods().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#64748b",
              fontSize: "1.1rem"
            }}
          >
            🔍 No foods found matching your search. Try a different term!
          </motion.div>
        )}
      </motion.div>
      {/* AI Food Search Component */}
<AiFoodSearch onAddFood={addAiFoodToIntake} />
{/* AI Meal Planner Component */}
<AiMealPlanner 
  user={user}
  dailyGoal={dailyGoal}
/>
      {/* Today's Meal Log Section */}
      <motion.div
        ref={mealLogRef}
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
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #10b981, #059669)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📋 Today's Meal Log
          </h2>

          {todayMealLog.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b",
                fontSize: "1.1rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "15px",
                border: "2px dashed rgba(255, 255, 255, 0.1)"
              }}
            >
              🍽️ No meals logged yet today. Add some foods from the recommendations above!
            </motion.div>
          ) : (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "15px",
                marginBottom: "20px"
              }}>
                <div style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  padding: "15px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid rgba(59, 130, 246, 0.2)"
                }}>
                  <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>Total Items</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#3b82f6" }}>{todayMealLog.length}</div>
                </div>

                <div style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  padding: "15px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid rgba(245, 158, 11, 0.2)"
                }}>
                  <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>Total Calories</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f59e0b" }}>
                    {todayMealLog.reduce((sum, item) => sum + item.calories, 0)}
                  </div>
                </div>

                <div style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "15px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid rgba(16, 185, 129, 0.2)"
                }}>
                  <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>Avg per Item</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10b981" }}>
                    {Math.round(todayMealLog.reduce((sum, item) => sum + item.calories, 0) / todayMealLog.length) || 0}
                  </div>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "15px"
              }}>
                <AnimatePresence>
                  {todayMealLog.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(15px)",
                        borderRadius: "15px",
                        padding: "20px",
                        border: `2px solid ${item.category === 'fat_loss' ? 'rgba(239, 68, 68, 0.2)' :
                          item.category === 'muscle_gain' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Category Icon */}
                      <div style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        width: "40px",
                        height: "40px",
                        background: `linear-gradient(135deg, ${item.category === 'fat_loss' ? '#ef4444' :
                          item.category === 'muscle_gain' ? '#10b981' : '#3b82f6'}20, ${item.category === 'fat_loss' ? '#ef4444' :
                          item.category === 'muscle_gain' ? '#10b981' : '#3b82f6'}10)`,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        border: `2px solid ${item.category === 'fat_loss' ? 'rgba(239, 68, 68, 0.3)' :
                          item.category === 'muscle_gain' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      }}>
                        {item.category === 'fat_loss' ? '🥗' : item.category === 'muscle_gain' ? '💪' : '🍎'}
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <h3 style={{
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          color: "#fff",
                          margin: "0 0 8px 0",
                          lineHeight: "1.2"
                        }}>
                          {item.name}
                        </h3>

                        <div style={{
                          fontSize: "0.8rem",
                          color: "#94a3b8",
                          marginBottom: "12px"
                        }}>
                          Added {new Date(item.timestamp).toLocaleTimeString()}
                        </div>

                        {/* Macronutrients */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "6px",
                          marginBottom: "12px"
                        }}>
                          <div style={{
                            background: "rgba(59, 130, 246, 0.1)",
                            padding: "6px",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "1px solid rgba(59, 130, 246, 0.2)"
                          }}>
                            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>Protein</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#3b82f6" }}>{item.protein}g</div>
                          </div>
                          <div style={{
                            background: "rgba(16, 185, 129, 0.1)",
                            padding: "6px",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "1px solid rgba(16, 185, 129, 0.2)"
                          }}>
                            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>Carbs</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#10b981" }}>{item.carbs}g</div>
                          </div>
                          <div style={{
                            background: "rgba(245, 158, 11, 0.1)",
                            padding: "6px",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "1px solid rgba(245, 158, 11, 0.2)"
                          }}>
                            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>Fat</div>
                            <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#f59e0b" }}>{item.fat}g</div>
                          </div>
                        </div>

                        {/* Calories */}
                        <div style={{
                          background: `linear-gradient(135deg, ${item.category === 'fat_loss' ? '#ef4444' :
                            item.category === 'muscle_gain' ? '#10b981' : '#3b82f6'}, ${item.category === 'fat_loss' ? '#ef4444' :
                            item.category === 'muscle_gain' ? '#10b981' : '#3b82f6'}cc)`,
                          padding: "8px 12px",
                          borderRadius: "10px",
                          textAlign: "center"
                        }}>
                          <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#fff" }}>
                            {item.calories} cal
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddMealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowAddMealModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
                borderRadius: "20px",
                padding: "30px",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                maxWidth: "500px",
                width: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: "#fff",
                  marginBottom: "25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🍽️</span> Add New Meal
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ color: "#cbd5e1", fontWeight: "600" }}>
                    Meal Name
                  </label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="e.g., Grilled Chicken Salad"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "#cbd5e1", fontWeight: "600" }}>
                    Calories
                  </label>
                  <input
                    type="number"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                    placeholder="e.g., 450"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "#cbd5e1", fontWeight: "600" }}>
                    Category
                  </label>
                  <select
                    value={mealCategory}
                    onChange={(e) => setMealCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      color: "#fff",
                      outline: "none",
                    }}
                  >
                    <option value="breakfast">🥐 Breakfast</option>
                    <option value="lunch">🍱 Lunch</option>
                    <option value="dinner">🍽️ Dinner</option>
                    <option value="snack">🍎 Snack</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addMeal}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Add Meal
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMealModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {showFoodModal && selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(15px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1200,
              padding: "20px",
            }}
            onClick={() => setShowFoodModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(25px) saturate(180%)",
                borderRadius: "25px",
                padding: "30px",
                border: `2px solid ${activeFoodCategory === 'fat_loss' ? 'rgba(239, 68, 68, 0.3)' :
                  activeFoodCategory === 'muscle_gain' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4)",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "25px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: `linear-gradient(135deg, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                      activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}20, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                      activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}10)`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    border: `2px solid ${activeFoodCategory === 'fat_loss' ? 'rgba(239, 68, 68, 0.3)' :
                      activeFoodCategory === 'muscle_gain' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  }}>
                    {activeFoodCategory === 'fat_loss' ? '🥗' : activeFoodCategory === 'muscle_gain' ? '💪' : '🍎'}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: "1.6rem",
                      fontWeight: "800",
                      color: "#fff",
                      margin: "0 0 5px 0"
                    }}>
                      {selectedFood.name}
                    </h3>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#94a3b8",
                      fontWeight: "600"
                    }}>
                      {activeFoodCategory === 'fat_loss' ? 'Fat Loss' : activeFoodCategory === 'muscle_gain' ? 'Muscle Gain' : 'Balanced'} • {selectedFood.calories} calories
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFoodModal(false)}
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#ef4444",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Macronutrient Breakdown */}
              <div style={{ marginBottom: "25px" }}>
                <h4 style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  color: "#fff",
                  margin: "0 0 15px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  📊 Macronutrient Breakdown
                </h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px"
                }}>
                  <div style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    padding: "15px",
                    borderRadius: "15px",
                    textAlign: "center",
                    border: "1px solid rgba(59, 130, 246, 0.3)"
                  }}>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>Protein</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#3b82f6" }}>{selectedFood.protein}g</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      {Math.round((selectedFood.protein * 4 / selectedFood.calories) * 100)}% of calories
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    padding: "15px",
                    borderRadius: "15px",
                    textAlign: "center",
                    border: "1px solid rgba(16, 185, 129, 0.3)"
                  }}>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>Carbs</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#10b981" }}>{selectedFood.carbs}g</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      {Math.round((selectedFood.carbs * 4 / selectedFood.calories) * 100)}% of calories
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    padding: "15px",
                    borderRadius: "15px",
                    textAlign: "center",
                    border: "1px solid rgba(245, 158, 11, 0.3)"
                  }}>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>Fat</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#f59e0b" }}>{selectedFood.fat}g</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      {Math.round((selectedFood.fat * 9 / selectedFood.calories) * 100)}% of calories
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Benefits */}
              <div style={{ marginBottom: "25px" }}>
                <h4 style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  color: "#fff",
                  margin: "0 0 15px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  💡 Health Benefits
                </h4>
                <div style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "15px",
                  borderRadius: "15px",
                  border: "1px solid rgba(16, 185, 129, 0.2)"
                }}>
                  {selectedFood.benefits.map((benefit, idx) => (
                    <div key={idx} style={{
                      fontSize: "0.9rem",
                      color: "#cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: idx < selectedFood.benefits.length - 1 ? "8px" : "0"
                    }}>
                      <span style={{ color: "#10b981", fontSize: "1.2rem" }}>•</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Calories Remaining Check */}
              {caloriesRemaining > 0 && (
                <div style={{
                  background: caloriesRemaining >= selectedFood.calories
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(245, 158, 11, 0.1)",
                  padding: "15px",
                  borderRadius: "15px",
                  border: `1px solid ${caloriesRemaining >= selectedFood.calories
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(245, 158, 11, 0.3)"}`,
                  marginBottom: "20px"
                }}>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#94a3b8",
                    fontWeight: "600",
                    marginBottom: "5px"
                  }}>
                    📊 Daily Budget Check:
                  </div>
                  <div style={{
                    fontSize: "1rem",
                    color: caloriesRemaining >= selectedFood.calories ? "#10b981" : "#f59e0b",
                    fontWeight: "700"
                  }}>
                    {caloriesRemaining >= selectedFood.calories
                      ? `✅ ${caloriesRemaining - selectedFood.calories} calories remaining after this meal`
                      : `⚠️ Only ${caloriesRemaining} calories left - this will put you ${selectedFood.calories - caloriesRemaining} over your goal`
                    }
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addFoodToIntake(selectedFood)}
                  style={{
                    flex: 1,
                    padding: "15px 25px",
                    borderRadius: "15px",
                    border: "none",
                    background: `linear-gradient(135deg, ${activeFoodCategory === 'fat_loss' ? '#ef4444' :
                      activeFoodCategory === 'muscle_gain' ? '#10b981' : '#3b82f6'}, ${activeFoodCategory === 'fat_loss' ? '#dc2626' :
                      activeFoodCategory === 'muscle_gain' ? '#059669' : '#2563eb'})`,
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: `0 6px 20px ${activeFoodCategory === 'fat_loss' ? 'rgba(239, 68, 68, 0.4)' :
                      activeFoodCategory === 'muscle_gain' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <span>➕</span>
                  Add to Daily Intake (+5 XP)
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFoodModal(false)}
                  style={{
                    padding: "15px 20px",
                    borderRadius: "15px",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#cbd5e1",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalorieTracker;
