import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_CONFIG } from "./config";

const AiFoodSearch = ({ onAddFood }) => {
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [aiSearchResults, setAiSearchResults] = useState([]);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // AI-Powered Food Search using API Ninjas
  const searchFoodWithAI = async (query) => {
    if (!query.trim()) {
      setToastMessage("Please enter a food name to search");
      setToastType("warning");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Clear previous results before new search
    setAiSearchResults([]);
    setAiSearchLoading(true);
    
    console.log('🔍 Searching for:', query);
    console.log('📡 API URL:', API_CONFIG.NINJAS_API_URL);
    
    try {
      const response = await axios.get(API_CONFIG.NINJAS_API_URL, {
        params: { query: query },
        headers: {
          'X-Api-Key': API_CONFIG.NINJAS_API_KEY
        }
      });

      console.log('✅ API Response:', response.data);

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

        console.log('🎯 Transformed Results:', transformedResults);
        setAiSearchResults(transformedResults);
        setToastMessage(`✅ Found ${transformedResults.length} results for "${query}"!`);
        setToastType("success");
      } else {
        console.log('⚠️ No results found');
        setAiSearchResults([]);
        setToastMessage(`No results found for "${query}". Try a different search term.`);
        setToastType("warning");
      }
    } catch (error) {
      console.error('❌ Error searching food with AI:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      let errorMsg = "Failed to search. ";
      if (error.response?.status === 429) {
        errorMsg = "Too many requests. Please wait a moment and try again.";
      } else if (error.response?.status === 401) {
        errorMsg = "API key error. Please check your configuration.";
      } else if (error.message.includes('Network')) {
        errorMsg = "Network error. Please check your internet connection.";
      } else {
        errorMsg += error.response?.data?.message || error.message || "Please try again.";
      }
      
      setToastMessage(errorMsg);
      setToastType("error");
      setAiSearchResults([]);
    } finally {
      setAiSearchLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
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
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </motion.div>
      )}

      <div style={{ marginBottom: "25px" }}>
        <h2 style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 15px 0"
        }}>
          🤖 AI-Powered Food Search
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "20px" }}>
          Search any food worldwide and get detailed nutritional information powered by AI
        </p>

        {/* AI Search Input */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
            <input
              type="text"
              placeholder="Search any food (e.g., pizza, apple, chicken breast)..."
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !aiSearchLoading) {
                  searchFoodWithAI(aiSearchQuery);
                }
              }}
              style={{
                width: "100%",
                padding: "14px 20px 14px 50px",
                borderRadius: "15px",
                border: "2px solid rgba(139, 92, 246, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(139, 92, 246, 0.6)";
                e.target.style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(139, 92, 246, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
            <div style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8b5cf6",
              fontSize: "1.3rem"
            }}>
              🤖
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => searchFoodWithAI(aiSearchQuery)}
            disabled={aiSearchLoading}
            style={{
              padding: "14px 30px",
              borderRadius: "15px",
              border: "none",
              background: aiSearchLoading 
                ? "rgba(139, 92, 246, 0.5)" 
                : "linear-gradient(135deg, #8b5cf6, #ec4899)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: aiSearchLoading ? "not-allowed" : "pointer",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
              transition: "all 0.3s ease",
              minWidth: "120px"
            }}
          >
            {aiSearchLoading ? "🔄 Searching..." : "🔍 Search"}
          </motion.button>
          
          {(aiSearchResults.length > 0 || aiSearchQuery) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAiSearchQuery("");
                setAiSearchResults([]);
              }}
              style={{
                padding: "14px 20px",
                borderRadius: "15px",
                border: "2px solid rgba(239, 68, 68, 0.5)",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              🗑️ Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* AI Search Results */}
      {aiSearchResults.length > 0 && (
        <div>
          <h3 style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "#cbd5e1",
            marginBottom: "15px"
          }}>
            Search Results ({aiSearchResults.length})
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px"
          }}>
            {aiSearchResults.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                style={{
                  background: "rgba(139, 92, 246, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "18px",
                  padding: "20px",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px"
                }}>
                  <h4 style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "#fff",
                    margin: 0,
                    flex: 1
                  }}>
                    {food.name}
                  </h4>
                  <div style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    padding: "4px 10px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#fff"
                  }}>
                    {food.calories} cal
                  </div>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                  marginBottom: "15px"
                }}>
                  <div style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    padding: "8px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Protein</div>
                    <div style={{ fontSize: "1rem", fontWeight: "700", color: "#3b82f6" }}>{food.protein}g</div>
                  </div>
                  <div style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    padding: "8px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Carbs</div>
                    <div style={{ fontSize: "1rem", fontWeight: "700", color: "#f59e0b" }}>{food.carbs}g</div>
                  </div>
                  <div style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    padding: "8px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Fat</div>
                    <div style={{ fontSize: "1rem", fontWeight: "700", color: "#ef4444" }}>{food.fat}g</div>
                  </div>
                </div>

                <div style={{
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  marginBottom: "12px"
                }}>
                  📏 Serving: {food.serving}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddFood(food)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  ➕ Add to Daily Intake
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {aiSearchResults.length === 0 && !aiSearchLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#64748b",
            fontSize: "1rem",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "15px",
            border: "2px dashed rgba(139, 92, 246, 0.2)"
          }}
        >
          🔍 Search for any food to see detailed nutritional information
        </motion.div>
      )}
    </motion.div>
  );
};

export default AiFoodSearch;
