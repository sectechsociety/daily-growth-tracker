/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { theme as designTheme } from './theme';

// --- React Icon Imports ---
import { 
  FiTarget, FiPlus, FiCheck, FiCircle, FiX, FiHeart, FiZap, 
  FiBookOpen, FiSunrise, FiUsers, FiHelpCircle, FiActivity, 
  FiWind, FiCpu, FiUser, FiSend, FiTrash2, FiSun, FiAward
} from 'react-icons/fi';

// --- Admin Configuration ---
const ADMIN_CONFIG = {
  MAX_XP_LIMIT: 100,
  DIFFICULTY_LEVELS: [
    { label: 'Easy (10 XP)', value: 10 },
    { label: 'Medium (30 XP)', value: 30 },
    { label: 'Hard (60 XP)', value: 60 },
    { label: 'Epic (100 XP)', value: 100 },
  ]
};

const welcomeMessage = {
  role: 'assistant',
  content: "👋 Hi! I'm AURA, your AI Growth Coach. Ask me anything about building better habits, productivity, or health. What's on your mind?"
};

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
        <span style={styles.panelIcon}><FiTarget /></span>
        <h2 style={styles.panelTitle}>My Growth Targets</h2>
      </div>
      <div style={styles.panelContent}>
        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            <p style={{ marginBottom: '16px' }}>No goals set yet. Start your growth journey!</p>
            <motion.button
              style={styles.panelButton}
              onClick={onAddGoal}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={16} style={{ marginRight: '6px' }} /> Set Your First Goal
            </motion.button>
          </div>
        ) : (
          <>
            <div style={{
              background: 'rgba(239, 246, 255, 0.8)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: '600' }}>Progress</span>
                <span style={{ color: '#059669', fontSize: '1.2rem', fontWeight: '700' }}>{completionRate}%</span>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                height: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#10b981',
                  width: `${completionRate}%`,
                  height: '100%',
                  borderRadius: '8px',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>

            {goals.map((goal) => (
              <div key={goal.id} style={{
                ...styles.targetItem,
                borderLeft: `4px solid ${getCategoryColor(goal.category)}`,
                background: goal.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.8)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1, overflow: 'hidden' }}>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    color: goal.completed ? '#059669' : getCategoryColor(goal.category), 
                    flexShrink: 0,
                    display: 'flex'
                  }}>
                    {goal.completed ? <FiCheck strokeWidth={3} /> : getCategoryIcon(goal.category)}
                  </span>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{
                      textDecoration: goal.completed ? 'line-through' : 'none',
                      color: goal.completed ? '#6b7280' : '#374151',
                      fontWeight: '600',
                      display: 'block',
                      opacity: goal.completed ? 0.6 : 1
                    }}>
                      {goal.text}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: '500' }}>
                      +{goal.xpValue} XP
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <motion.button
                    onClick={() => onToggleGoal(goal.id, goal.xpValue)}
                    style={{
                      background: goal.completed ? '#10b981' : 'rgba(139, 92, 246, 0.1)',
                      border: goal.completed ? 'none' : '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px', 
                      padding: '4px 10px',
                      cursor: 'pointer',
                      color: goal.completed ? '#fff' : '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      height: '24px'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {goal.completed ? 'DONE' : <FiCircle size={14} />}
                  </motion.button>

                  <motion.button
                    onClick={() => onDeleteGoal(goal.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                      padding: '0 10px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#ef4444',
                      height: '24px'
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    clear
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
              <FiPlus size={16} style={{ marginRight: '6px' }} /> Add New Goal
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

const GuidancePanel = () => {
  const [expanded, setExpanded] = useState(null);
  const tips = [
    { icon: <FiActivity />, title: 'Gym Workout Tips', content: '• Focus on compound lifts...\n• Ensure proper form...\n• Aim for progressive overload...' },
    { icon: <FiSunrise />, title: 'Yoga & Flexibility', content: '• Start with a 5-10 minute warm-up...\n• Listen to your body...\n• Hold stretches for 15-30 seconds.' },
    { icon: <FiWind />, title: 'Running & Cardio', content: '• Mix steady-state cardio with HIIT...\n• Invest in good running shoes...\n• Remember to hydrate.' },
    { icon: <FiHeart />, title: 'Food & Nutrition', content: '• Prioritize protein...\n• Eat a variety of colorful fruits...\n• A balanced meal includes protein, carbs, and healthy fats.' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      style={styles.panel}
    >
      <div style={styles.panelHeader}>
        <span style={styles.panelIcon}><FiHelpCircle /></span>
        <h2 style={styles.panelTitle}>Expert Guidance</h2>
      </div>
      <div style={styles.panelContent}>
        {tips.map((tip, index) => (
          <div key={index} style={styles.accordionItem}>
            <motion.header
              style={styles.accordionHeader}
              onClick={() => setExpanded(expanded === index ? null : index)}
              whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem', color: '#8b5cf6' }}>{tip.icon}</span>
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

export default function AIAssistant({ addXP }) {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem('aura-chat-messages');
      return savedMessages ? JSON.parse(savedMessages) : [welcomeMessage];
    } catch (e) {
      return [welcomeMessage];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    text: '',
    category: 'health',
    xpValue: 30 
  });
  
  const [modalInputRef, setModalInputRef] = useState(null);
  const chatEndRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedGoals = localStorage.getItem('growth-goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('growth-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (showGoalModal && modalInputRef) modalInputRef.focus();
  }, [showGoalModal, modalInputRef]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('aura-chat-messages', JSON.stringify(messages.slice(-10)));
    } catch (e) {
      console.error("Failed to save messages:", e);
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    const userMessage = { role: 'user', content: trimmedPrompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('⚠️ Missing API Key.');
      setIsLoading(false);
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are AURA, a growth coach. Use context to help with fitness/habits. Prompt: ${trimmedPrompt}` }] }]
        }),
      });

      const data = await res.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I am here to help!';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      setError('❌ Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.text.trim()) {
      const goal = {
        id: Date.now(),
        text: newGoal.text.trim(),
        category: newGoal.category, 
        xpValue: Math.min(newGoal.xpValue, ADMIN_CONFIG.MAX_XP_LIMIT), 
        completed: false,
        createdAt: new Date().toISOString()
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({ text: '', category: 'health', xpValue: 30 });
      setShowGoalModal(false);
    }
  };

  const handleToggleGoal = (goalId, xpValue) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const isCompleting = !goal.completed;
        if (isCompleting && addXP) {
          addXP(`goal-${goal.id}`, xpValue); 
        }
        return { ...goal, completed: isCompleting };
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (goalId) => setGoals(prev => prev.filter(g => g.id !== goalId));

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health': return <FiHeart />;
      case 'productivity': return <FiZap />;
      case 'learning': return <FiBookOpen />;
      case 'mindfulness': return <FiSunrise />;
      case 'social': return <FiUsers />;
      default: return <FiTarget />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'health': return '#10B981';
      case 'productivity': return '#F59E0B';
      case 'learning': return '#3B82F6';
      case 'mindfulness': return '#8B5CF6';
      case 'social': return '#EC4899';
      default: return '#6B7280';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundEffect}>
        <div style={styles.floatingOrb1} />
        <div style={styles.floatingOrb2} />
      </div>
      
      <motion.div style={styles.innerContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}><span style={styles.icon}><FiCpu /></span> AI Growth Assistant</h1>
          <p style={styles.subtitle}>Your intelligent companion for personal development</p>
        </div>

        <div style={styles.mainLayout}>
          <div style={styles.leftColumn}>
            <div style={styles.chatContainer}>
              {messages.map((msg, index) => (
                <div key={index} style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                  <div style={styles.messageContent}>
                    <div style={styles.messageRole}>{msg.role === 'user' ? 'You' : 'AURA'}</div>
                    <div style={styles.messageText}>{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && <div style={styles.loadingText}>AURA is thinking...</div>}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputWrapper}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={styles.input}
                  placeholder="Ask AURA..."
                  rows={1}
                />
                <button type="submit" style={styles.button}>Ask AURA</button>
              </div>
            </form>
            <button onClick={() => { localStorage.removeItem('aura-chat-messages'); setMessages([welcomeMessage]); }} style={styles.clearButton}>
              <FiTrash2 size={12} /> Clear Memory
            </button>
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

      <AnimatePresence>
        {showGoalModal && (
          <motion.div style={styles.modalOverlay} onClick={() => setShowGoalModal(false)}>
            <motion.div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}><FiTarget /> Set New Goal</h3>
                <button onClick={() => setShowGoalModal(false)} style={styles.modalCloseButton}><FiX /></button>
              </div>
              <div style={styles.modalContent}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Goal Description</label>
                  <textarea
                    ref={setModalInputRef}
                    value={newGoal.text}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, text: e.target.value }))}
                    style={styles.modalInput}
                    placeholder="E.g. Morning 5km run"
                    rows={2}
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Goal Difficulty (XP Reward)</label>
                  <select
                    value={newGoal.xpValue}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, xpValue: parseInt(e.target.value) }))}
                    style={styles.modalSelect}
                  >
                    {ADMIN_CONFIG.DIFFICULTY_LEVELS.map(lvl => (
                      <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                    style={styles.modalSelect}
                  >
                    <option value="health">Health & Fitness</option>
                    <option value="productivity">Productivity</option>
                    <option value="learning">Learning</option>
                    <option value="mindfulness">Mindfulness</option>
                  </select>
                </div>
                <div style={styles.modalActions}>
                  <button onClick={handleAddGoal} style={styles.modalSaveButton}>Save Goal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: { background: 'linear-gradient(135deg, #f7f3ff 0%, #e9dfff 100%)', minHeight: '100vh', padding: '32px', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' },
  backgroundEffect: { position: 'absolute', inset: 0, zIndex: 0 },
  floatingOrb1: { position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, transparent 70%)' },
  floatingOrb2: { position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)' },
  innerContainer: { position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '32px' },
  title: { fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(90deg, #6d28d9, #4c1d95)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' },
  icon: { fontSize: '2.2rem' },
  subtitle: { color: '#5b21b6', fontSize: '1.1rem', fontWeight: '500' },
  mainLayout: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  rightColumn: { display: 'flex', flexDirection: 'column', gap: '24px' },
  chatContainer: { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '24px', minHeight: '450px', maxHeight: '500px', overflowY: 'auto', border: '1px solid white', display: 'flex', flexDirection: 'column', gap: '16px' },
  userMessage: { alignSelf: 'flex-end', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '12px 18px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%' },
  assistantMessage: { alignSelf: 'flex-start', background: 'white', padding: '12px 18px', borderRadius: '16px 16px 16px 4px', border: '1px solid #eee', maxWidth: '80%' },
  messageRole: { fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: '#8b5cf6' },
  messageText: { fontSize: '0.95rem', lineHeight: '1.5' },
  form: { marginTop: '10px' },
  inputWrapper: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' },
  button: { background: '#6366f1', color: 'white', border: 'none', padding: '0 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  clearButton: { alignSelf: 'center', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', marginTop: '10px' },
  panel: { background: 'rgba(255, 255, 255, 0.7)', borderRadius: '20px', border: '1px solid white', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  panelHeader: { padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' },
  panelTitle: { fontSize: '1rem', fontWeight: 'bold', margin: 0 },
  panelContent: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  panelButton: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px dashed #6366f1', background: 'rgba(99,102,241,0.05)', color: '#6366f1', cursor: 'pointer' },
  targetItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'white', border: '1px solid #f0f0f0' },
  accordionItem: { border: '1px solid #eee', borderRadius: '12px', marginBottom: '8px' },
  accordionHeader: { padding: '14px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' },
  accordionContent: { padding: '0 14px 14px', fontSize: '0.9rem', color: '#666' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '450px', padding: '0' },
  modalHeader: { padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalContent: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', color: '#666' },
  modalInput: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd' },
  modalSelect: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd' },
  modalSaveButton: { background: '#6366f1', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
};