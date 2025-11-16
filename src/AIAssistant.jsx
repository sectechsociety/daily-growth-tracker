/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { theme as designTheme } from './theme';

// Helper component for accordion icons
const AccordionIcon = ({ isOpen }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    style={{ width: '20px', height: '20px', flexShrink: 0 }}
    animate={{ rotate: isOpen ? 90 : 0 }}
    transition={{ duration: 0.3 }}
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </motion.svg>
);

// Target setting panel component
const TargetSetterPanel = ({ goals, onAddGoal, onToggleGoal, onDeleteGoal, getCategoryIcon, getCategoryColor }) => {
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={styles.panel}
    >
      <div style={styles.panelHeader}>
        <span style={styles.panelIcon}>🎯</span>
        <h2 style={styles.panelTitle}>My Growth Targets</h2>
      </div>
      <div style={styles.panelContent}>
        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
            <p style={{ marginBottom: '16px' }}>No goals set yet. Start your growth journey!</p>
            <motion.button
              style={styles.panelButton}
              onClick={onAddGoal}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              ➕ Set Your First Goal
            </motion.button>
          </div>
        ) : (
          <>
            {/* Goals Summary */}
            <div style={{
              background: 'rgba(234, 243, 240, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '600' }}>Progress</span>
                <span style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: '700' }}>{completionRate}%</span>
              </div>
              <div style={{
                background: 'rgba(251, 255, 254, 0.2)',
                borderRadius: '8px',
                height: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: designTheme.success,
                  width: `${completionRate}%`,
                  height: '100%',
                  borderRadius: '8px',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  {completedGoals} of {totalGoals} completed
                </span>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  {totalGoals - completedGoals} remaining
                </span>
              </div>
            </div>

            {goals.map((goal) => (
              <div key={goal.id} style={{
                ...styles.targetItem,
                borderLeft: `4px solid ${getCategoryColor(goal.category)}`,
                opacity: goal.completed ? 0.7 : 1,
                background: goal.completed 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : 'rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {goal.completed ? '✅' : getCategoryIcon(goal.category)}
                  </span>
                  <span style={{ 
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    color: goal.completed ? '#9ca3af' : '#e5e7eb'
                  }}>
                    {goal.text}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <motion.button
                    onClick={() => onToggleGoal(goal.id)}
                    style={{
                      background: goal.completed ? '#10b981' : 'rgba(139, 92, 246, 0.3)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={goal.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {goal.completed ? '✓' : '○'}
                  </motion.button>
                  <motion.button
                    onClick={() => onDeleteGoal(goal.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.3)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete goal"
                  >
                    ×
                  </motion.button>
                </div>
              </div>
            ))}
            <motion.button
              style={styles.panelButton}
              onClick={onAddGoal}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              ➕ Add New Goal
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Guidance panel with expandable tips
const GuidancePanel = () => {
  const [expanded, setExpanded] = useState(null);

  const tips = [
    {
      icon: '🏋️‍♂️',
      title: 'Gym Workout Tips',
      content: '• Focus on compound lifts like squats, deadlifts, and bench press.\n• Ensure proper form to prevent injury.\n• Aim for progressive overload—gradually increase weight or reps.'
    },
    {
      icon: '🧘',
      title: 'Yoga & Flexibility',
      content: '• Start with a 5-10 minute warm-up.\n• Listen to your body and don\'t push past pain.\n• Hold stretches for 15-30 seconds. Consistency is key!'
    },
    {
      icon: '🏃',
      title: 'Running & Cardio',
      content: '• Mix steady-state cardio with high-intensity interval training (HIIT).\n• Invest in good running shoes to protect your joints.\n• Remember to hydrate before, during, and after your run.'
    },
    {
      icon: '🍎',
      title: 'Food & Nutrition',
      content: '• Prioritize protein for muscle repair and satiety.\n• Eat a variety of colorful fruits and vegetables.\n• A balanced meal includes protein, carbs, and healthy fats.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      style={styles.panel}
    >
      <div style={styles.panelHeader}>
        <span style={styles.panelIcon}>💡</span>
        <h2 style={styles.panelTitle}>Expert Guidance</h2>
      </div>
      <div style={styles.panelContent}>
        {tips.map((tip, index) => (
          <div key={index} style={styles.accordionItem}>
            <motion.header
              style={styles.accordionHeader}
              onClick={() => setExpanded(expanded === index ? null : index)}
              whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>{tip.icon}</span>
                <span>{tip.title}</span>
              </div>
              <AccordionIcon isOpen={expanded === index} />
            </motion.header>
            <AnimatePresence>
              {expanded === index && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={styles.accordionContent}
                >
                  {tip.content}
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Main AI Assistant component
export default function AIAssistant() {
  const { theme } = useTheme();
  const currentTheme = theme || {};
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm AURA, your AI Growth Coach. Ask me anything about building better habits, productivity, or health. What's on your mind?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [goalCategory, setGoalCategory] = useState('health');
  const [modalInputRef, setModalInputRef] = useState(null);

  // --- 🧠 NEW: CONVERSATION MEMORY STATE ---
  const [conversationHistory, setConversationHistory] = useState([]);

  const chatEndRef = useRef(null);

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('growth-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('growth-goals', JSON.stringify(goals));
  }, [goals]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (showGoalModal && modalInputRef) {
      modalInputRef.focus();
    }
  }, [showGoalModal, modalInputRef]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 🧠 NEW: LOAD & SAVE MEMORY ---
  useEffect(() => {
    const savedHistory = localStorage.getItem('aura-conversation-history');
    if (savedHistory) {
      setConversationHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aura-conversation-history', JSON.stringify(conversationHistory.slice(-5)));
  }, [conversationHistory]);
  // --- END OF NEW MEMORY LOGIC ---

  // =================================================================
  // === NEW `handleSubmit` (with Memory & Better Filters) ===
  // =================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError('Please enter a question!');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // ✅ SMART GUARDRAIL v2 — Broader Health & Fitness Understanding
    const growthKeywords = [
      // General growth and mindset
      'growth', 'habit', 'motivat', 'discipline', 'focus', 'goal', 'routine',
      'mindset', 'self improve', 'consistency', 'progress', 'success', 'reflection',
      'time management', 'energy', 'mental', 'confidence', 'productiv', 'mindfulness',
      'stress', 'peace', 'relax', 'calm', 'focus', 'study', 'learn better',

      // Health & fitness core
      'health', 'fit', 'fitness', 'gym', 'workout', 'train', 'training', 'exercise',
      'cardio', 'weight', 'muscle', 'strength', 'flexibility', 'stretch', 'recovery',
      'lose', 'loss', 'gain', 'burn', 'reduce', 'tone', 'cut', 'bulk', 'body fat', 'fat',
      'shape', 'physique', 'endurance', 'stamina', 'running', 'jogging', 'walking',

      // Food, nutrition, and diet
      'nutrition', 'food', 'diet', 'meal', 'plan', 'protein', 'calories', 'deficit',
      'carbs', 'fats', 'fiber', 'water', 'hydration', 'sleep', 'rest', 'eating',
      'metabolism', 'healthy', 'cook', 'snack', 'hydrating',

      // Recovery and wellness
      'yoga', 'meditation', 'mindful', 'breathe', 'wellness', 'balance', 'rest day',

      // General
      'how are you', 'hi', 'hello' // Greetings
    ];

    const bannedKeywords = [
      // Tech
      'python', 'java', 'javascript', 'c++', 'coding', 'programming', 'html', 'css',
      'react', 'node', 'api', 'database', 'project', 'git', 'terminal', 'command',
      'machine learning', 'data science', 'algorithm', 'ai model',

      // Entertainment / others
      'movie', 'film', 'actor', 'actress', 'series', 'music', 'song', 'game', 'gaming',
      'celebrity', 'politics', 'history', 'war', 'country', 'sports', 'team',
      'math', 'physics', 'chemistry', 'exam', 'formula'
    ];

    const promptLower = trimmedPrompt.toLowerCase();
    
    // ✅ New pattern-based matching for natural language
    const isActionBasedFitnessQuery = /(lose|reduce|burn|gain|tone|build|cut|drop|increase|improve|boost|develop)\s?(fat|weight|muscle|stamina|strength|fitness|focus|discipline|productivity)/i.test(promptLower);

    // Check if it's a greeting first
    const isGreeting = ['how are you', 'hi', 'hello'].some(keyword => promptLower.includes(keyword));
    const isGrowthRelated = growthKeywords.some(keyword => promptLower.includes(keyword)) || isActionBasedFitnessQuery;
    const isBanned = bannedKeywords.some(keyword => promptLower.includes(keyword));

    // Allow greetings, but block banned keywords even if they are mixed with growth keywords
    if (isBanned) {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: trimmedPrompt },
        { role: 'assistant', content: "⚠️ Sorry! I can only help you with health, fitness, productivity, and personal growth — not coding or movies. 🌱" },
      ]);
      setPrompt('');
      return;
    }

    // If it's not a greeting and not growth-related, check for health/fitness related questions
    if (!isGrowthRelated && !isGreeting) {
      // Check if it's a health/fitness question that wasn't caught by the keyword filter
      const isHealthQuestion = /(lose weight|weight loss|burn fat|how to slim|how to get fit|healthy diet|exercise routine)/i.test(trimmedPrompt);
      
      if (isHealthQuestion) {
        // If it's a health question that wasn't caught by keywords, let it through
        console.log('Health-related question detected:', trimmedPrompt);
      } else {
        // If it's truly unrelated, show the error message
        setMessages(prev => [
          ...prev,
          { role: 'user', content: trimmedPrompt },
          { role: 'assistant', content: "🤔 I'm here to help with health, fitness, personal growth, and productivity. Could you rephrase your question to be more specific about your goals?" },
        ]);
        setPrompt('');
        return;
      }
    }

    // --- Passed filters, now proceed ---
    const userMessage = { role: 'user', content: trimmedPrompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('⚠️ Missing API Key. Add VITE_GEMINI_API_KEY to your .env file.');
      setIsLoading(false);
      return;
    }

    // --- 🧠 NEW: Build context with MEMORY ---
    const completedGoalsCount = goals.filter(g => g.completed).length;
    const totalGoalsCount = goals.length;
    const pendingGoals = goals.filter(g => !g.completed);

    // Save user message in memory
    setConversationHistory(prev => {
      const updated = [...prev, trimmedPrompt];
      return updated.slice(-5); // Keep only the last 5
    });

    const memorySummary =
      conversationHistory.length > 0
        ? conversationHistory.map((msg, i) => `(${i + 1}) ${msg}`).join('\n')
        : 'No prior questions yet. This is the start of the journey.';
    // --- End of memory logic ---

    // --- This is the 429 Error Fix (Goal Summaries) ---
    const categoryCounts = pendingGoals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {});

    const goalsSummary = totalGoalsCount
      ? `Goals set: ${totalGoalsCount}, Completed: ${completedGoalsCount}, Pending: ${pendingGoals.length}`
      : 'No goals set yet.';
    const categorySummary =
      pendingGoals.length > 0
        ? `Pending goals by category: ${Object.entries(categoryCounts)
            .map(([cat, count]) => `${cat} (${count})`)
            .join(', ')}`
        : 'No pending goals right now — great job!';

    const moodPrompt =
      totalGoalsCount === 0
        ? 'Encourage them to set new goals.'
        : completedGoalsCount === 0
        ? 'Be uplifting — the user is starting out.'
        : completedGoalsCount / totalGoalsCount < 0.5
        ? 'Be motivating — help them stay consistent.'
        : 'Celebrate progress — inspire continued success.';
    
    // --- End of context building ---

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // --- 🧠 NEW: Upgraded Payload with Memory ---
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are **AURA**, the user's Personal AI Growth Coach integrated into the Daily Growth Tracker App.  
Your mission is to guide the user in *fitness, health, nutrition, mindfulness, productivity, and personal growth* — like a wise, friendly mentor and trainer combined.  

---

### 🧩 YOUR ROLE
You are a compassionate, knowledgeable coach who helps the user:
- Lose fat safely
- Build muscle naturally
- Improve focus, motivation, and consistency
- Design workouts, daily routines, and balanced meals
- Build sustainable discipline and a positive mindset

You are **NOT** a generic chatbot. You are the user's *long-term growth partner*.

---

### ⚙️ RULES & BEHAVIOR
1. **ONLY** respond to questions about:
   - Health, fitness, food, habits, mindset, productivity, recovery, motivation, yoga, or mindfulness.
2. **NEVER** answer unrelated topics (coding, history, politics, movies, AI models, etc.).
3. Keep advice *realistic and beginner-safe*. Avoid extreme diets or medical recommendations.
4. Include motivational tone and emojis like 💪🥗🔥🧘🌿.
5. Structure answers clearly — use bullet points, sections, or 7-day/3-day templates if needed.
6. Personalize responses using the user's goals, progress, and memory.
7. If the user mentions *weight loss, muscle gain, or routine building*, generate detailed structured plans (like meal plans, workouts, or checklists).
8. Encourage tracking progress inside the Daily Growth Tracker app.
9. NEVER start every reply the same way — vary your tone naturally.
10. If unsure, gently ask clarifying questions like a real coach would.

---

### 🧘‍♂️ CONTEXT DATA
User's current goals:
${goalsSummary}
${categorySummary}

Recent conversation history (last 5 messages):
${memorySummary}

Mood context:
${moodPrompt}

---

### 🧭 RESPONSE EXAMPLES:
If the user says:
> "I want to lose 3 kg of fat."

Respond like:
> "🔥 Great goal! Here's a 7-day fat-loss starter plan:  
> 🥗 **Nutrition:** 400-calorie deficit daily (focus on eggs, dal, lean meats, veggies).  
> 🏋️‍♂️ **Workout:** 4 days strength + 2 days cardio (walking, cycling, or HIIT).  
> 💧 **Hydration:** 3L/day.  
> 💤 **Sleep:** 7–8 hours.  
> Track your meals and habits daily — small wins add up!"

If the user says:
> "How can I improve focus and motivation?"

Respond like:
> "🎯 Focus = mental fitness. Try:  
> 1. 25-min deep work sessions (Pomodoro).  
> 2. Journal 3 wins each day.  
> 3. Morning light walk ☀️  
> 4. One micro goal per day.  
> You'll feel momentum build within a week!"

---

### USER'S QUESTION:
"${trimmedPrompt}"`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
    };
    // --- END OF PAYLOAD ---

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 429) {
           setError('⚠️ Too many requests. Try again soon.');
           setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry! I\'m a bit busy. Please try again later.' }]);
        } else {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `API Error: ${res.status}`);
        }
        return; // Stop execution if there was a non-critical error like 429
      }

      const data = await res.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

    } catch (err) {
      console.error('AI Error:', err);
      setError(`❌ ${err.message || 'Failed to get AI response.'}`);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry! An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  // =================================================================
  // === END OF UPDATED FUNCTION ===
  // =================================================================


  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal = {
        id: Date.now(),
        text: newGoal.trim(),
        category: goalCategory,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal('');
      setShowGoalModal(false);
      setGoalCategory('health');
      console.log('Goal added successfully:', goal);
    } else {
      console.log('Cannot add empty goal');
    }
  };

  const handleToggleGoal = (goalId) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            completed: !goal.completed,
            completedAt: !goal.completed ? new Date().toISOString() : null 
          }
        : goal
    ));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleModalKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newGoal.trim()) {
        handleAddGoal();
      }
    } else if (e.key === 'Escape') {
      setShowGoalModal(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health': return '💪';
      case 'productivity': return '⚡';
      case 'learning': return '📚';
      case 'mindfulness': return '🧘';
      case 'social': return '👥';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'health': return '#10b981';
      case 'productivity': return '#f59e0b';
      case 'learning': return '#3b82f6';
      case 'mindfulness': return '#8b5cf6';
      case 'social': return '#ef4444';
      default: return '#6ee7b7';
    }
  };

  const containerStyle = {
    ...styles.container,
    background: currentTheme.background || styles.container.background,
    color: currentTheme.textPrimary || styles.container.color,
  };

  return (
    <div style={containerStyle}>
      <div style={styles.backgroundEffect}></div>
      <div style={styles.floatingOrb1}></div>
      <div style={styles.floatingOrb2}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.innerContainer}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={styles.header}
        >
          <h1 style={styles.title}>
            <span style={styles.icon}>🤖</span>
            AI Growth Assistant
          </h1>
          <p style={styles.subtitle}>
            Your intelligent companion for personal development
          </p>
        </motion.div>

        <div style={styles.mainLayout}>
          <div style={styles.leftColumn}>
            <div style={styles.chatContainer}>
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
                  >
                    <div style={styles.messageIcon}>
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div style={styles.messageContent}>
                      <div style={styles.messageRole}>
                        {msg.role === 'user' ? 'You' : 'AURA'}
                      </div>
                      <div style={styles.messageText}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={styles.loadingContainer}
                >
                  <div style={styles.loadingDots}>
                    <span style={styles.dot}>●</span>
                    <span style={{...styles.dot, animationDelay: '0.2s'}}>●</span>
                    <span style={{...styles.dot, animationDelay: '0.4s'}}>●</span>
                  </div>
                  <span style={styles.loadingText}>AURA is thinking...</span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={styles.errorBanner}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <div style={styles.inputWrapper}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={styles.input}
                  placeholder="Ask AURA about growth, habits, productivity..."
                  disabled={isLoading}
                  rows={1}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  style={{
                    ...styles.button,
                    opacity: isLoading || !prompt.trim() ? 0.5 : 1,
                    cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer'
                  }}
                  whileHover={!isLoading && prompt.trim() ? { scale: 1.05 } : {}}
                  whileTap={!isLoading && prompt.trim() ? { scale: 0.95 } : {}}
                >
                  {isLoading ? (
                    <>
                      <span style={styles.spinner}></span>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Ask AURA
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
            
            {/* --- 🧠 NEW: CLEAR MEMORY BUTTON --- */}
            <button
              onClick={() => {
                localStorage.removeItem('aura-conversation-history');
                setConversationHistory([]);
                setMessages(prev => [
                  ...prev,
                  { role: 'assistant', content: '🧹 Memory cleared! We can start our conversation fresh.' }
                ]);
              }}
              style={styles.clearButton}
            >
              🧹 Clear Memory
            </button>
            {/* --- END: NEW --- */}


            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={styles.suggestions}
            >
              <p style={styles.suggestionsTitle}>💡 Try asking:</p>
              <div style={styles.suggestionButtons}>
                {[
                  "How can I build a morning routine?",
                  "Tips for staying motivated",
                  "Best productivity techniques",
                  "How to set SMART goals?"
                ].map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setPrompt(suggestion)}
                    style={styles.suggestionButton}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div style={styles.rightColumn}>
            <TargetSetterPanel 
              goals={goals}
              onAddGoal={() => setShowGoalModal(true)}
              onToggleGoal={handleToggleGoal}
              onDeleteGoal={handleDeleteGoal}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
            />
            <GuidancePanel />
          </div>
        </div>
      </motion.div>

      {/* Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              style={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>🎯 Set New Goal</h3>
                <motion.button
                  onClick={() => setShowGoalModal(false)}
                  style={styles.modalCloseButton}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
              <div style={styles.modalContent}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Goal Description</label>
                  <textarea
                    ref={setModalInputRef}
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={handleModalKeyPress}
                    style={styles.modalInput}
                    placeholder="What do you want to achieve?"
                    rows={3}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    style={styles.modalSelect}
                  >
                    <option value="health">💪 Health & Fitness</option>
                    <option value="productivity">⚡ Productivity</option>
                    <option value="learning">📚 Learning</option>
                    <option value="mindfulness">🧘 Mindfulness</option>
                    <option value="social">👥 Social</option>
                  </select>
                </div>
                <div style={styles.modalActions}>
                  <motion.button
                    onClick={() => setShowGoalModal(false)}
                    style={styles.modalCancelButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleAddGoal}
                    disabled={!newGoal.trim()}
                    style={{
                      ...styles.modalSaveButton,
                      opacity: newGoal.trim() ? 1 : 0.5,
                      cursor: newGoal.trim() ? 'pointer' : 'not-allowed'
                    }}
                    whileHover={newGoal.trim() ? { scale: 1.05 } : {}}
                    whileTap={newGoal.trim() ? { scale: 0.95 } : {}}
                  >
                    Save Goal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Styles object
const styles = {
  // Unified white page container
  container: {
    background: designTheme.background,
    minHeight: '100vh',
    padding: '48px 32px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  // Decorative effects removed for pure white aesthetic
  backgroundEffect: { display: 'none' },
  floatingOrb1: { display: 'none' },
  floatingOrb2: { display: 'none' },
  innerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '0px',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '800',
    color: designTheme.textPrimary,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  icon: {
    fontSize: '2.8rem',
    filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.5))',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#718096',
    fontWeight: '500',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth <= 1024 ? '1fr' : '1.4fr 1fr',
    gap: '32px',
    alignItems: 'flex-start',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    position: 'sticky',
    top: '20px',
  },
  chatContainer: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    padding: '32px',
    minHeight: '450px',
    maxHeight: '550px',
    overflowY: 'auto',
    border: '2px solid rgba(139, 127, 199, 0.2)',
    boxShadow: '0 12px 40px rgba(139, 127, 199, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  userMessage: {
    display: 'flex',
    gap: '12px',
    alignSelf: 'flex-end',
    maxWidth: '75%',
    background: 'rgba(255,255,255,0.95)',
    padding: '18px',
    borderRadius: '18px 18px 4px 18px',
    border: `2px solid ${designTheme.borderColor}`,
    boxShadow: designTheme.shadow,
  },
  assistantMessage: {
    display: 'flex',
    gap: '12px',
    alignSelf: 'flex-start',
    maxWidth: '75%',
    background: 'rgba(255,255,255,0.9)',
    padding: '18px',
    borderRadius: '18px 18px 18px 4px',
    border: '2px solid rgba(139, 127, 199, 0.2)',
  },
  messageIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  messageRole: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#9ca3af',
    letterSpacing: '1px',
  },
  messageText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#2D3748',
    whiteSpace: 'pre-wrap',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(31, 41, 55, 0.6)',
    borderRadius: '12px',
    alignSelf: 'flex-start',
  },
  loadingDots: {
    display: 'flex',
    gap: '6px',
  },
  dot: {
    fontSize: '1.5rem',
    color: '#8b5cf6',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: '0.9rem',
  },
  errorBanner: {
    background: designTheme.danger,
    padding: '16px 24px',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(139, 127, 199, 0.3)',
    borderRadius: '16px',
    padding: '18px 22px',
    color: '#2D3748',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'none',
    minHeight: '60px',
    maxHeight: '150px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  button: {
    background: designTheme.accent,
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    padding: '18px 36px',
    fontSize: '1rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  suggestions: {
    textAlign: 'center',
  },
  suggestionsTitle: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    marginBottom: '12px',
    fontWeight: '600',
  },
  suggestionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
  },
  suggestionButton: {
    background: 'rgba(139, 92, 246, 0.2)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
    borderRadius: '20px',
    padding: '8px 16px',
    color: '#fff',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  panel: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '2px solid rgba(139, 127, 199, 0.2)',
    boxShadow: '0 12px 40px rgba(139, 127, 199, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
    color: '#2D3748',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
    background: designTheme.cardBg,
    borderBottom: `2px solid ${designTheme.borderColor}`,
  },
  panelIcon: {
    fontSize: '1.6rem',
  },
  panelTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    margin: 0,
    color: '#2D3748',
  },
  panelContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  targetItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.7)',
    padding: '14px 18px',
    borderRadius: '14px',
    color: '#2D3748',
    fontSize: '0.95rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  targetProgress: {
    color: '#6ee7b7',
    fontWeight: '600',
  },
  panelButton: {
    background: designTheme.accent,
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
  accordionItem: {
    border: '2px solid rgba(139, 127, 199, 0.2)',
    borderRadius: '14px',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.6)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  accordionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    color: '#2D3748',
  },
  accordionContent: {
    padding: '0 18px 18px 18px',
    fontSize: '0.95rem',
    color: '#4A5568',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    background: designTheme.cardBg,
    borderRadius: '20px',
    border: `2px solid ${designTheme.borderColor}`,
    boxShadow: designTheme.shadow,
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: `1px solid ${designTheme.borderColor}`,
    background: designTheme.cardBg,
  },
  modalTitle: {
    margin: 0,
    color: designTheme.textPrimary,
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  modalCloseButton: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    color: '#ef4444',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  modalInput: {
    background: '#ffffff',
    border: `2px solid ${designTheme.borderColor}`,
    borderRadius: '12px',
    padding: '16px',
    color: designTheme.textPrimary,
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.3s ease',
  },
  modalSelect: {
    background: '#ffffff',
    border: `2px solid ${designTheme.borderColor}`,
    borderRadius: '12px',
    padding: '16px',
    color: designTheme.textPrimary,
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  modalCancelButton: {
    background: 'rgba(107, 114, 128, 0.8)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  modalSaveButton: {
    background: designTheme.accent,
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  
  // --- 🧠 NEW: STYLE FOR CLEAR BUTTON ---
  clearButton: {
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '10px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    marginTop: '0px', // Adjusted margin
    marginBottom: '15px', // Adjusted margin
    width: 'fit-content',
    alignSelf: 'center', 
    transition: 'all 0.3s ease',
  }
};

// CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive styles */
  @media (max-width: 1024px) {
    .mainLayout {
      grid-template-columns: 1fr !important;
      gap: 24px !important;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem !important;
    }
    .chatContainer {
      padding: 24px !important;
      min-height: 350px !important;
    }
    .inputWrapper {
      flex-direction: column !important;
      gap: 12px !important;
    }
    .button {
      width: 100% !important;
      justify-content: center !important;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 16px !important;
    }
    h1 {
      font-size: 1.8rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);