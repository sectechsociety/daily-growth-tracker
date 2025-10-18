import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const CalorieTracker = ({ userId }) => {
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealCategory, setMealCategory] = useState("breakfast");
  const [confirmReset, setConfirmReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);

  const API_URL = 'http://localhost:5000/api';

  // Helper function for authenticated requests
  const makeAuthenticatedRequest = async (url, data = null, method = 'GET') => {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: { userid: userId }
    };
    if (data) config.data = data;
    return axios(config);
  };

  // Load today's calorie data from backend
  useEffect(() => {
    if (userId) {
      loadTodayData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadTodayData = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest('/calories/today');
      const data = response.data;

      setCaloriesConsumed(data.totalCalories || 0);
      setDailyGoal(data.dailyGoal || 2000);
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Error loading calorie data:', error);
      // Fallback to localStorage for offline mode
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedCalories = localStorage.getItem("caloriesConsumed");
    const savedGoal = localStorage.getItem("dailyCalorieGoal");
    if (savedCalories) setCaloriesConsumed(parseInt(savedCalories));
    if (savedGoal) setDailyGoal(parseInt(savedGoal));
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
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Reset form
        setMealName("");
        setMealCalories("");
        setMealCategory("breakfast");
        setShowAddMealModal(false);
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      // Fallback to localStorage
      setCaloriesConsumed((prev) => prev + calories);
      setMealName("");
      setMealCalories("");
      setMealCategory("breakfast");
      setShowAddMealModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
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
        setConfirmReset(false);
      } catch (error) {
        console.error('Error resetting calories:', error);
        // Fallback to local behavior
        setCaloriesConsumed(0);
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
      } catch (error) {
        console.error('Error updating calorie goal:', error);
        // Fallback to local behavior
        setDailyGoal(newGoal);
      }
    }
  };

  const caloriesRemaining = dailyGoal - caloriesConsumed;
  const progressPercentage = Math.min(
    (caloriesConsumed / dailyGoal) * 100,
    100
  );
  const isOverGoal = caloriesConsumed > dailyGoal;

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
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              padding: "14px 22px",
              borderRadius: "10px",
              fontWeight: "600",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
              zIndex: 1500,
            }}
          >
            ✅ Meal Added Successfully! +5 XP Gained!
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
                value={dailyGoal}
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
                {caloriesConsumed}
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
    </motion.div>
  );
};

export default CalorieTracker;
