import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Apple, Plus, X, Check, Trophy, TrendingUp, Activity,
  Flame, Droplet, Zap, Heart, AlertCircle, Sparkles
} from "lucide-react";
import { theme } from "./theme";
import {
  auth,
  onAuthStateChange,
  getUserProfile
} from "./firebase";

// Nutrition requirements by age group
const getNutritionRequirements = (age) => {
  if (!age || age < 1) {
    return {
      ageGroup: "Not Set",
      protein: 50,
      carbs: 130,
      fats: 44,
      fiber: 25,
      iron: 8,
      calcium: 1000
    };
  }

  if (age <= 12) {
    return {
      ageGroup: "Child",
      protein: 19,
      carbs: 130,
      fats: 25,
      fiber: 20,
      iron: 8,
      calcium: 1000
    };
  } else if (age <= 18) {
    return {
      ageGroup: "Teenager",
      protein: 52,
      carbs: 130,
      fats: 44,
      fiber: 26,
      iron: 11,
      calcium: 1300
    };
  } else if (age <= 50) {
    return {
      ageGroup: "Adult",
      protein: 56,
      carbs: 130,
      fats: 44,
      fiber: 28,
      iron: 8,
      calcium: 1000
    };
  } else {
    return {
      ageGroup: "Older Adult",
      protein: 56,
      carbs: 130,
      fats: 44,
      fiber: 22,
      iron: 8,
      calcium: 1200
    };
  }
};

// Common foods database with nutrition per 100g
const FOOD_DATABASE = [
  // Proteins
  { name: "Chicken Breast", protein: 31, carbs: 0, fats: 3.6, fiber: 0, iron: 0.7, calcium: 15, emoji: "🍗" },
  { name: "Eggs", protein: 13, carbs: 1.1, fats: 11, fiber: 0, iron: 1.8, calcium: 56, emoji: "🥚" },
  { name: "Greek Yogurt", protein: 10, carbs: 3.6, fats: 0.4, fiber: 0, iron: 0.1, calcium: 110, emoji: "🥛" },
  { name: "Salmon", protein: 25, carbs: 0, fats: 13, fiber: 0, iron: 0.8, calcium: 12, emoji: "🐟" },
  { name: "Tofu", protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3, iron: 5.4, calcium: 350, emoji: "🥢" },
  
  // Carbs
  { name: "Brown Rice", protein: 2.6, carbs: 23, fats: 0.9, fiber: 1.8, iron: 0.4, calcium: 10, emoji: "🍚" },
  { name: "Oatmeal", protein: 2.4, carbs: 12, fats: 1.4, fiber: 1.7, iron: 0.7, calcium: 9, emoji: "🥣" },
  { name: "Whole Wheat Bread", protein: 9, carbs: 41, fats: 3.4, fiber: 6, iron: 2.5, calcium: 151, emoji: "🍞" },
  { name: "Sweet Potato", protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, iron: 0.6, calcium: 30, emoji: "🍠" },
  { name: "Quinoa", protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8, iron: 1.5, calcium: 17, emoji: "🌾" },
  
  // Healthy Fats
  { name: "Avocado", protein: 2, carbs: 8.5, fats: 15, fiber: 6.7, iron: 0.6, calcium: 12, emoji: "🥑" },
  { name: "Almonds", protein: 21, carbs: 22, fats: 49, fiber: 12, iron: 3.7, calcium: 269, emoji: "🌰" },
  { name: "Olive Oil", protein: 0, carbs: 0, fats: 100, fiber: 0, iron: 0.4, calcium: 1, emoji: "🫒" },
  { name: "Peanut Butter", protein: 25, carbs: 20, fats: 50, fiber: 6, iron: 1.9, calcium: 43, emoji: "🥜" },
  
  // Vegetables & Fruits
  { name: "Spinach", protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, iron: 2.7, calcium: 99, emoji: "🥬" },
  { name: "Broccoli", protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6, iron: 0.7, calcium: 47, emoji: "🥦" },
  { name: "Banana", protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6, iron: 0.3, calcium: 5, emoji: "🍌" },
  { name: "Apple", protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4, iron: 0.1, calcium: 6, emoji: "🍎" },
  { name: "Carrots", protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, iron: 0.3, calcium: 33, emoji: "🥕" },
  { name: "Berries", protein: 0.7, carbs: 12, fats: 0.3, fiber: 2, iron: 0.3, calcium: 16, emoji: "🫐" }
];

function NutritionTracker() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAge, setUserAge] = useState(null);
  const [requirements, setRequirements] = useState(getNutritionRequirements(25));
  
  // Today's logged foods
  const [loggedFoods, setLoggedFoods] = useState([]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  
  // XP tracking
  const [xpEarned, setXpEarned] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Totals
  const [totals, setTotals] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    iron: 0,
    calcium: 0
  });

  // Load user data and nutrition logs
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          const age = parseInt(profile?.age) || 25;
          setUserAge(age);
          setRequirements(getNutritionRequirements(age));
          
          // Load today's logs from localStorage
          const today = new Date().toISOString().split('T')[0];
          const savedLogs = JSON.parse(localStorage.getItem(`nutrition_${today}`) || '[]');
          setLoggedFoods(savedLogs);
          
          // Check if XP already earned today
          const xpStatus = JSON.parse(localStorage.getItem(`nutritionXP_${today}`) || 'false');
          setXpEarned(xpStatus);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate totals whenever logged foods change
  useEffect(() => {
    const newTotals = loggedFoods.reduce((acc, item) => {
      const multiplier = item.quantity / 100;
      return {
        protein: acc.protein + (item.nutrition.protein * multiplier),
        carbs: acc.carbs + (item.nutrition.carbs * multiplier),
        fats: acc.fats + (item.nutrition.fats * multiplier),
        fiber: acc.fiber + (item.nutrition.fiber * multiplier),
        iron: acc.iron + (item.nutrition.iron * multiplier),
        calcium: acc.calcium + (item.nutrition.calcium * multiplier)
      };
    }, { protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, calcium: 0 });
    
    setTotals(newTotals);
    
    // Check if goals met and award XP
    checkNutritionGoals(newTotals);
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`nutrition_${today}`, JSON.stringify(loggedFoods));
  }, [loggedFoods]);

  // Check if nutrition goals are met
  const checkNutritionGoals = (currentTotals) => {
    if (xpEarned) return; // Already earned XP today
    
    const goalsMet = 
      currentTotals.protein >= requirements.protein &&
      currentTotals.carbs >= requirements.carbs &&
      currentTotals.fats >= requirements.fats;
    
    if (goalsMet) {
      setXpEarned(true);
      setShowSuccess(true);
      
      // Save XP status
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`nutritionXP_${today}`, 'true');
      
      // Award XP to user
      awardNutritionXP();
      
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  // Award XP for meeting nutrition goals
  const awardNutritionXP = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentXP = storedUser.xp || 0;
    const currentLevel = storedUser.level || 1;
    
    const xpToAdd = 20; // Fixed XP for nutrition goals
    const newXP = currentXP + xpToAdd;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    const updatedUser = {
      ...storedUser,
      xp: newXP,
      level: newLevel
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update daily XP
    const today = new Date().toISOString().split('T')[0];
    const dailyXPData = JSON.parse(localStorage.getItem('dailyXP') || '{}');
    dailyXPData[today] = (dailyXPData[today] || 0) + xpToAdd;
    localStorage.setItem('dailyXP', JSON.stringify(dailyXPData));
  };

  // Add food to log
  const handleAddFood = () => {
    if (!selectedFood || quantity <= 0) return;
    
    const newEntry = {
      id: Date.now(),
      name: selectedFood.name,
      emoji: selectedFood.emoji,
      quantity: quantity,
      nutrition: {
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fats: selectedFood.fats,
        fiber: selectedFood.fiber,
        iron: selectedFood.iron,
        calcium: selectedFood.calcium
      },
      timestamp: new Date().toISOString()
    };
    
    setLoggedFoods([...loggedFoods, newEntry]);
    setShowAddFood(false);
    setSelectedFood(null);
    setQuantity(100);
    setSearchTerm("");
  };

  // Remove food from log
  const handleRemoveFood = (id) => {
    setLoggedFoods(loggedFoods.filter(item => item.id !== id));
  };

  // Calculate percentage
  const getPercentage = (current, required) => {
    return Math.min((current / required) * 100, 100);
  };

  // Get suggestion text
  const getSuggestion = () => {
    if (totals.protein < requirements.protein) {
      return "💪 Add protein-rich foods like chicken, eggs, or Greek yogurt";
    }
    if (totals.carbs < requirements.carbs) {
      return "🌾 Include complex carbs like brown rice, oats, or quinoa";
    }
    if (totals.fats < requirements.fats) {
      return "🥑 Add healthy fats like avocado, nuts, or olive oil";
    }
    return "✨ You're doing great! Keep it up!";
  };

  // Filter foods by search
  const filteredFoods = FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#F5F3FF"
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: "64px",
            height: "64px",
            border: "4px solid #8B7FC7",
            borderTopColor: "transparent",
            borderRadius: "50%"
          }}
        />
      </div>
    );
  }

  const macroGoalsMet = 
    totals.protein >= requirements.protein &&
    totals.carbs >= requirements.carbs &&
    totals.fats >= requirements.fats;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F5F3FF 0%, #E8F5E9 100%)",
      padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              style={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                padding: "20px 32px",
                borderRadius: "16px",
                boxShadow: "0 12px 40px rgba(16, 185, 129, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              <Trophy size={24} />
              🎉 Daily Nutrition Goal Achieved! +20 XP Earned
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            marginBottom: "32px"
          }}
        >
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: theme.textPrimary,
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px"
          }}>
            <Apple size={36} color={theme.accent} />
            Nutrition Tracker
          </h1>
          <p style={{
            fontSize: "1rem",
            color: theme.textSecondary,
            marginBottom: "8px"
          }}>
            Track your daily nutrition and earn XP for healthy eating
          </p>
          {userAge && (
            <p style={{
              fontSize: "0.9rem",
              color: theme.accent,
              fontWeight: "600"
            }}>
              Age Group: {requirements.ageGroup} ({userAge} years old)
            </p>
          )}
        </motion.div>

        {/* Main Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {/* Left Column - Macro Nutrients */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Protein Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Zap size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: theme.textPrimary,
                      marginBottom: "2px"
                    }}>
                      Protein 💪
                    </h3>
                    <p style={{
                      fontSize: "0.75rem",
                      color: theme.textSecondary
                    }}>
                      Daily minimum: {requirements.protein}g
                    </p>
                  </div>
                </div>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: totals.protein >= requirements.protein ? "#10b981" : "#ef4444"
                }}>
                  {Math.round(totals.protein)}g
                </div>
              </div>
              
              <div style={{
                width: "100%",
                height: "12px",
                background: "#f3f4f6",
                borderRadius: "20px",
                overflow: "hidden"
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(totals.protein, requirements.protein)}%` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #ef4444, #dc2626)",
                    borderRadius: "20px"
                  }}
                />
              </div>
              
              <p style={{
                fontSize: "0.8rem",
                color: theme.textSecondary,
                marginTop: "8px",
                textAlign: "center"
              }}>
                {Math.round(getPercentage(totals.protein, requirements.protein))}% of daily goal
              </p>
            </motion.div>

            {/* Carbs Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Flame size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: theme.textPrimary,
                      marginBottom: "2px"
                    }}>
                      Carbohydrates 🌾
                    </h3>
                    <p style={{
                      fontSize: "0.75rem",
                      color: theme.textSecondary
                    }}>
                      Daily minimum: {requirements.carbs}g
                    </p>
                  </div>
                </div>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: totals.carbs >= requirements.carbs ? "#10b981" : "#f59e0b"
                }}>
                  {Math.round(totals.carbs)}g
                </div>
              </div>
              
              <div style={{
                width: "100%",
                height: "12px",
                background: "#f3f4f6",
                borderRadius: "20px",
                overflow: "hidden"
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(totals.carbs, requirements.carbs)}%` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #f59e0b, #d97706)",
                    borderRadius: "20px"
                  }}
                />
              </div>
              
              <p style={{
                fontSize: "0.8rem",
                color: theme.textSecondary,
                marginTop: "8px",
                textAlign: "center"
              }}>
                {Math.round(getPercentage(totals.carbs, requirements.carbs))}% of daily goal
              </p>
            </motion.div>

            {/* Fats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #8B7FC7, #7a6db5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Droplet size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: theme.textPrimary,
                      marginBottom: "2px"
                    }}>
                      Healthy Fats 🥑
                    </h3>
                    <p style={{
                      fontSize: "0.75rem",
                      color: theme.textSecondary
                    }}>
                      Daily minimum: {requirements.fats}g
                    </p>
                  </div>
                </div>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: totals.fats >= requirements.fats ? "#10b981" : "#8B7FC7"
                }}>
                  {Math.round(totals.fats)}g
                </div>
              </div>
              
              <div style={{
                width: "100%",
                height: "12px",
                background: "#f3f4f6",
                borderRadius: "20px",
                overflow: "hidden"
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(totals.fats, requirements.fats)}%` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #8B7FC7, #7a6db5)",
                    borderRadius: "20px"
                  }}
                />
              </div>
              
              <p style={{
                fontSize: "0.8rem",
                color: theme.textSecondary,
                marginTop: "8px",
                textAlign: "center"
              }}>
                {Math.round(getPercentage(totals.fats, requirements.fats))}% of daily goal
              </p>
            </motion.div>

            {/* Micronutrients Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <h3 style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: theme.textPrimary,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <Heart size={20} color={theme.accent} />
                Micronutrients
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Fiber */}
                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px"
                  }}>
                    <span style={{ fontSize: "0.9rem", color: theme.textSecondary }}>
                      Fiber
                    </span>
                    <span style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: totals.fiber >= requirements.fiber ? "#10b981" : theme.textPrimary
                    }}>
                      {Math.round(totals.fiber)}g / {requirements.fiber}g
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "6px",
                    background: "#f3f4f6",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${getPercentage(totals.fiber, requirements.fiber)}%`,
                      height: "100%",
                      background: "#10b981",
                      borderRadius: "10px",
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>

                {/* Iron */}
                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px"
                  }}>
                    <span style={{ fontSize: "0.9rem", color: theme.textSecondary }}>
                      Iron
                    </span>
                    <span style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: totals.iron >= requirements.iron ? "#10b981" : theme.textPrimary
                    }}>
                      {Math.round(totals.iron)}mg / {requirements.iron}mg
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "6px",
                    background: "#f3f4f6",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${getPercentage(totals.iron, requirements.iron)}%`,
                      height: "100%",
                      background: "#ef4444",
                      borderRadius: "10px",
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>

                {/* Calcium */}
                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px"
                  }}>
                    <span style={{ fontSize: "0.9rem", color: theme.textSecondary }}>
                      Calcium
                    </span>
                    <span style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: totals.calcium >= requirements.calcium ? "#10b981" : theme.textPrimary
                    }}>
                      {Math.round(totals.calcium)}mg / {requirements.calcium}mg
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "6px",
                    background: "#f3f4f6",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${getPercentage(totals.calcium, requirements.calcium)}%`,
                      height: "100%",
                      background: "#3b82f6",
                      borderRadius: "10px",
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Food Log */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Daily Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: macroGoalsMet
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
                borderRadius: "20px",
                padding: "24px",
                color: "#ffffff",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "800",
                    marginBottom: "8px"
                  }}>
                    {macroGoalsMet ? "Goals Achieved! 🎉" : "Keep Going! 💪"}
                  </h3>
                  <p style={{
                    fontSize: "0.9rem",
                    opacity: 0.9
                  }}>
                    {macroGoalsMet
                      ? xpEarned
                        ? "XP already earned today!"
                        : "Earning +20 XP..."
                      : getSuggestion()}
                  </p>
                </div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {macroGoalsMet ? <Check size={32} /> : <Activity size={32} />}
                </div>
              </div>
            </motion.div>

            {/* Add Food Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddFood(true)}
              style={{
                background: theme.accent,
                color: "#ffffff",
                border: "none",
                borderRadius: "16px",
                padding: "16px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 8px 24px rgba(139, 127, 199, 0.3)"
              }}
            >
              <Plus size={20} />
              Log Food
            </motion.button>

            {/* Logged Foods List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: "700",
                color: theme.textPrimary,
                marginBottom: "16px"
              }}>
                Today's Meals 🍽️
              </h3>
              
              {loggedFoods.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "32px",
                  color: theme.textSecondary
                }}>
                  <Apple size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                  <p>No foods logged yet</p>
                  <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                    Start tracking your nutrition!
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxHeight: "500px",
                  overflowY: "auto"
                }}>
                  {loggedFoods.map((food) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{
                        background: "#f9fafb",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <span style={{ fontSize: "2rem" }}>{food.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: theme.textPrimary,
                            marginBottom: "4px"
                          }}>
                            {food.name}
                          </h4>
                          <p style={{
                            fontSize: "0.8rem",
                            color: theme.textSecondary
                          }}>
                            {food.quantity}g • P: {Math.round(food.nutrition.protein * food.quantity / 100)}g • 
                            C: {Math.round(food.nutrition.carbs * food.quantity / 100)}g • 
                            F: {Math.round(food.nutrition.fats * food.quantity / 100)}g
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFood(food.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "8px"
                        }}
                      >
                        <X size={20} color="#ef4444" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Add Food Modal */}
        <AnimatePresence>
          {showAddFood && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddFood(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px"
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#ffffff",
                  borderRadius: "24px",
                  padding: "32px",
                  maxWidth: "600px",
                  width: "100%",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.3)"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px"
                }}>
                  <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: theme.textPrimary
                  }}>
                    Add Food
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddFood(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px"
                    }}
                  >
                    <X size={24} color={theme.textPrimary} />
                  </motion.button>
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    outline: "none",
                    marginBottom: "20px"
                  }}
                />

                {/* Food List */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "12px",
                  marginBottom: "24px",
                  maxHeight: "300px",
                  overflowY: "auto"
                }}>
                  {filteredFoods.map((food, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFood(food)}
                      style={{
                        background: selectedFood?.name === food.name ? theme.accent : "#f9fafb",
                        color: selectedFood?.name === food.name ? "#ffffff" : theme.textPrimary,
                        border: "2px solid",
                        borderColor: selectedFood?.name === food.name ? theme.accent : "#e5e7eb",
                        borderRadius: "12px",
                        padding: "16px 12px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>{food.emoji}</span>
                      {food.name}
                    </motion.button>
                  ))}
                </div>

                {/* Quantity */}
                {selectedFood && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: "24px" }}
                  >
                    <label style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: theme.textSecondary,
                      marginBottom: "8px"
                    }}>
                      Quantity (grams)
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      min="1"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "2px solid #e5e7eb",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                    />
                    <p style={{
                      fontSize: "0.8rem",
                      color: theme.textSecondary,
                      marginTop: "8px"
                    }}>
                      Nutrition per 100g: P: {selectedFood.protein}g • C: {selectedFood.carbs}g • F: {selectedFood.fats}g
                    </p>
                  </motion.div>
                )}

                {/* Add Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddFood}
                  disabled={!selectedFood || quantity <= 0}
                  style={{
                    width: "100%",
                    background: selectedFood && quantity > 0
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "#e5e7eb",
                    color: selectedFood && quantity > 0 ? "#ffffff" : "#9ca3af",
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: selectedFood && quantity > 0 ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <Check size={20} />
                  Add to Log
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default NutritionTracker;