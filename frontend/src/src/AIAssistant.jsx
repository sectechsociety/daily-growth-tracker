import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Styles ---
const styles = {
  container: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    color: 'white',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  innerContainer: {
    width: '100%',
    maxWidth: '896px', // max-w-3xl
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    fontSize: '2.25rem', // text-4xl
    lineHeight: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #a855f7, #60a5fa)', // purple-500 to blue-400
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  subtitle: {
    color: '#9ca3af', // gray-400
    marginTop: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    flexGrow: 1,
    backgroundColor: '#1f2937', // gray-800
    color: 'white',
    border: '2px solid #374151', // gray-700
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  button: {
    backgroundColor: '#9333ea', // purple-600
    color: 'white',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
  },
  responseArea: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)', // gray-800/50
    border: '1px solid #374151', // gray-700
    borderRadius: '8px',
    padding: '24px',
    minHeight: '200px',
    transition: 'opacity 0.5s ease',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.75',
  },
  error: {
    color: '#f87171', // red-400
    backgroundColor: 'rgba(127, 29, 29, 0.5)', // red-900/50
    padding: '12px',
    borderRadius: '8px',
  },
  sourceList: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #374151', // gray-700
  },
  sourceTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#9ca3af', // gray-400
    marginBottom: '8px',
  },
  sourceLink: {
    color: '#60a5fa', // blue-400
    textDecoration: 'underline',
    fontSize: '0.875rem',
  },
};

// --- Component ---
export default function AIAssistant() {
  // --- State Management ---
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState({
    text: "Ask me anything to boost your growth... For example: 'How can I build a consistent morning routine?'",
    sources: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Firebase state
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- Firebase Initialization and Auth ---
  useEffect(() => {
    const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || '{}');
    if (!firebaseConfig) {
      setError('Firebase configuration is missing.');
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);
      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          await signInAnonymously(authInstance);
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error('Error initializing Firebase:', e);
      setError('Failed to initialize Firebase.');
    }
  }, []);

  // --- Event Handlers ---
  const handlePromptChange = (e) => setPrompt(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError('Please enter a question or prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse({ text: '🤖 Thinking...', sources: [] });

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: trimmedPrompt }] }],
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        throw new Error(`API call failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      setResponse({ text: aiResponse, sources: [] });

      if (db && userId) {
        const userDocRef = doc(db, 'users', userId, 'ai-interactions', new Date().toISOString());
        await setDoc(userDocRef, {
          prompt: trimmedPrompt,
          response: aiResponse,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch AI response. Please try again.');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>AI Growth Assistant</h1>
          <p style={styles.subtitle}>Your partner in personal and professional development.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={prompt}
            onChange={handlePromptChange}
            style={styles.input}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        <div style={styles.responseArea}>
          {error && <div style={styles.error}>{error}</div>}
          {!error && <p>{response.text}</p>}
        </div>
      </div>
    </div>
  );
}