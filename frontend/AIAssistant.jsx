import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';

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
const TargetSetterPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={styles.panel}
    >
      <div style={styles.panelHeader}>
        <span style={styles.panelIcon}></span>
        <h2 style={styles.panelTitle}>My Growth Targets</h2>
      </div>
      <div style={styles.panelContent}>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center' }}>
          Your personal goals will appear here. We'll connect this to your database next!
        </p>
        <div style={styles.targetItem}>
          <span>Walk 8,000 steps</span>
          <div style={styles.targetProgress}>...</div>
        </div>
        <div style={styles.targetItem}>
          <span>Log Calories Daily</span>
          <div style={styles.targetProgress}>...</div>
        </div>
        <motion.button
          style={styles.panelButton}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Set a New Goal
        </motion.button>
      </div>
    </motion.div>
  );
};

// Guidance panel with expandable tips
const GuidancePanel = () => {
  const [expanded, setExpanded] = useState(null);

  const tips = [
    {
      icon: '',
      title: 'Gym Workout Tips',
      content: ' Focus on compound lifts like squats, deadlifts, and bench press.\n Ensure proper form to prevent injury.\n Aim for progressive overloadâ€”gradually increase weight or reps.'
    },
    {
      icon: '',
      title: 'Yoga & Flexibility',
      content: ' Start with a 5-10 minute warm-up.\n Listen to your body and don\'t push past pain.\n Hold stretches for 15-30 seconds. Consistency is key!'
    },
    {
      icon: '',
      title: 'Running & Cardio',
      content: ' Mix steady-state cardio with high-intensity interval training (HIIT).\n Invest in good running shoes to protect your joints.\n Remember to hydrate before, during, and after your run.'
    },
    {
      icon: '',
      title: 'Food & Nutrition',
      content: ' Prioritize protein for muscle repair and satiety.\n Eat a variety of colorful fruits and vegetables.\n A balanced meal includes protein, carbs, and healthy fats.'
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
        <span style={styles.panelIcon}></span>
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
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: " Hi! I'm your AI Growth Assistant. Ask me anything about:\n\n Building better habits\n Productivity tips\n Goal setting strategies\n Time management\n Personal development\n Motivation and mindset\n\nWhat would you like to know?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError('Please enter a question!');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const userMessage = { role: 'user', content: trimmedPrompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setError(' API Key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
      setIsLoading(false);
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: `You are a helpful and motivating AI Growth Assistant for a daily growth tracking app.
You are helping a user who is tracking their calories, tasks, and goals.
Answer questions about personal development, productivity, habits, goal setting, gym workouts, yoga, running, and nutrition.
Keep responses clear, actionable, and encouraging. Use emojis to make it friendly.
User question: ${trimmedPrompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${res.status}`);
      }

      const data = await res.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      console.error('AI Error:', err);
      setError(`âŒ ${err.message || 'Failed to get AI response. Please try again.'}`);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: ' Sorry, I encountered an error. Please try asking your question again!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.container}>
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
            <span style={styles.icon}></span>
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
                      {msg.role === 'user' ? 'ðŸ‘¤' : 'ðŸ¤–'}
                    </div>
                    <div style={styles.messageContent}>
                      <div style={styles.messageRole}>
                        {msg.role === 'user' ? 'You' : 'AI Assistant'}
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
                    <span style={styles.dot}></span>
                    <span style={{...styles.dot, animationDelay: '0.2s'}}></span>
                    <span style={{...styles.dot, animationDelay: '0.4s'}}></span>
                  </div>
                  <span style={styles.loadingText}>AI is thinking...</span>
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
                  placeholder="Ask me anything about growth, habits, productivity..."
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
                      <span>âœ¨</span>
                      Ask AI
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={styles.suggestions}
            >
              <p style={styles.suggestionsTitle}>ðŸ’¡ Try asking:</p>
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
            <TargetSetterPanel />
            <GuidancePanel />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Styles object
const styles = {
  container: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '800px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'pulse 4s ease-in-out infinite',
  },
  floatingOrb1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 6s ease-in-out infinite',
    pointerEvents: 'none',
  },
  floatingOrb2: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'float 8s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
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
    fontSize: '3rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #a855f7, #60a5fa, #10b981)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  icon: {
    fontSize: '3rem',
    filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#9ca3af',
    fontWeight: '400',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    alignItems: 'flex-start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'sticky',
    top: '20px',
  },
  chatContainer: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '30px',
    minHeight: '400px',
    maxHeight: '500px',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  userMessage: {
    display: 'flex',
    gap: '12px',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    padding: '16px',
    borderRadius: '16px 16px 4px 16px',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
  },
  assistantMessage: {
    display: 'flex',
    gap: '12px',
    alignSelf: 'flex-start',
    maxWidth: '80%',
    background: 'rgba(31, 41, 55, 0.8)',
    padding: '16px',
    borderRadius: '16px 16px 16px 4px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
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
    color: '#fff',
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
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
    gap: '12px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    background: 'rgba(31, 41, 55, 0.8)',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '16px',
    padding: '16px 20px',
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'none',
    minHeight: '56px',
    maxHeight: '150px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  button: {
    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 32px',
    fontSize: '1rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
    transition: 'all 0.3s ease',
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
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    color: '#fff',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  panelIcon: {
    fontSize: '1.5rem',
  },
  panelTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    margin: 0,
  },
  panelContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  targetItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '12px 16px',
    borderRadius: '12px',
    color: '#e5e7eb',
    fontSize: '0.9rem',
  },
  targetProgress: {
    color: '#6ee7b7',
    fontWeight: '600',
  },
  panelButton: {
    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
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
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'rgba(31, 41, 55, 0.5)',
  },
  accordionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  accordionContent: {
    padding: '0 16px 16px 16px',
    fontSize: '0.9rem',
    color: '#d1d5db',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
};

// CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `\n  @keyframes pulse {\n    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }\n    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }\n  }\n  @keyframes float {\n    0%, 100% { transform: translateY(0px); }\n    50% { transform: translateY(-20px); }\n  }\n  @keyframes bounce {\n    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }\n    40% { transform: scale(1); opacity: 1; }\n  }\n  @keyframes spin {\n    to { transform: rotate(360deg); }\n  }\n`;
document.head.appendChild(styleSheet);

