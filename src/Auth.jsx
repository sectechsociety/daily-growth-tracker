
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useTheme } from "./ThemeContext";

function Auth({ setUser, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const API_URL = 'http://localhost:5000/api/auth';

  // Check for existing token on component load
  useEffect(() => {
    const checkExistingAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          // Verify token validity
          if (token.startsWith('offline_')) {
            // Offline token - validate against stored users
            const storedUsers = JSON.parse(localStorage.getItem('offline_users') || '[]');
            const userExists = storedUsers.find(u => u.email === userData.email);

            if (userExists) {
              setUser(userData);
              setToken(token);
              return;
            }
          } else {
            // Backend token - verify with backend
            axios.get(`${API_URL}/verify`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
              setUser(response.data.user);
              setToken(token);
            })
            .catch(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            });
            return;
          }
        } catch (err) {
          console.error('Error parsing stored auth data:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else if (storedUser) {
        // Has user data but no token - create temporary token for session
        try {
          const userData = JSON.parse(storedUser);
          const tempToken = 'offline_temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          setUser(userData);
          setToken(tempToken);
          localStorage.setItem('token', tempToken);
        } catch (err) {
          console.error('Error with stored user data:', err);
          localStorage.removeItem('user');
        }
      }
    };

    checkExistingAuth();
  }, []);

  const [authStatus, setAuthStatus] = useState('idle'); // idle, loading, success, error

  const handleAuth = async () => {
    setIsLoading(true);
    setMessage("");
    setAuthStatus('loading');

    try {
      if (isLogin) {
        // Login - Try backend first, fallback to localStorage
        try {
          const response = await axios.post(`${API_URL}/login`, { email, password });
          const { user, token } = response.data;

          setUser(user);
          setToken(token);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          setAuthStatus('success');
          setMessage("✅ Welcome back! Redirecting...");

          setTimeout(() => {
            navigate("/");
          }, 1000);

        } catch (backendError) {
          // Backend unavailable - use localStorage fallback
          console.log('Backend unavailable, using localStorage authentication');
          const storedUsers = JSON.parse(localStorage.getItem('offline_users') || '[]');
          const foundUser = storedUsers.find(u => u.email === email && u.password === password);

          if (foundUser) {
            const mockToken = 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const userData = {
              _id: foundUser.id,
              email: foundUser.email,
              name: foundUser.name,
              level: foundUser.level || 1,
              xp: foundUser.xp || 0,
              streak: foundUser.streak || 0,
              tasksCompleted: foundUser.tasksCompleted || 0
            };

            setUser(userData);
            setToken(mockToken);
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setAuthStatus('success');
            setMessage("✅ Signed in successfully! Redirecting..."); 

            setTimeout(() => {
              navigate("/");
            }, 1000);

          } else {
            setMessage("❌ Invalid email or password. Please try again or create an account.");
            setAuthStatus('error');
          }
        }
      } else {
        // Register
        if (password.length < 6) {
          setMessage("❌ Password must be at least 6 characters");
          setAuthStatus('error');
          setIsLoading(false);
          return;
        }

        if (!name.trim()) {
          setMessage("❌ Name is required");
          setAuthStatus('error');
          setIsLoading(false);
          return;
        }

        // Try backend first, fallback to localStorage
        try {
          const response = await axios.post(`${API_URL}/register`, {
            email,
            password,
            name: name.trim()
          });
          const { user, token } = response.data;

          setUser(user);
          setToken(token);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          setAuthStatus('success');
          setMessage("✅ Account created successfully! Redirecting...");

          setTimeout(() => {
            navigate("/");
          }, 1000);

        } catch (backendError) {
          // Backend unavailable - use localStorage fallback
          console.log('Backend unavailable, creating offline account');
          const storedUsers = JSON.parse(localStorage.getItem('offline_users') || '[]');

          // Check if email already exists
          if (storedUsers.find(u => u.email === email)) {
            setMessage("❌ Email already registered. Please sign in.");
            setAuthStatus('error');
            setIsLoading(false);
            return;
          }

          const newUser = {
            id: 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            email,
            password, // In production, this should be hashed
            name: name.trim(),
            level: 1,
            xp: 0,
            streak: 0,
            tasksCompleted: 0,
            createdAt: new Date().toISOString()
          };

          storedUsers.push(newUser);
          localStorage.setItem('offline_users', JSON.stringify(storedUsers));

          const mockToken = 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          const userData = {
            _id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            level: 1,
            xp: 0,
            streak: 0,
            tasksCompleted: 0
          };

          setUser(userData);
          setToken(mockToken);
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(userData));

          setAuthStatus('success');
          setMessage("✅ Account created successfully! Redirecting...");

          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || '❌ Authentication failed. Please check your connection and try again.';
      setMessage(errorMessage);
      setAuthStatus('error');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate("/auth");
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setMessage("Please enter your email address");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("Please enter and confirm your new password");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Try backend first
      try {
        const response = await axios.post(`${API_URL}/reset-password`, {
          email: resetEmail,
          newPassword: newPassword
        });
        
        if (response.data.success) {
          setMessage("Password reset successful! You can now sign in with your new password.");
          setTimeout(() => {
            setShowForgotPassword(false);
            setResetEmail("");
            setNewPassword("");
            setConfirmPassword("");
            setMessage("");
          }, 3000);
        }
      } catch (backendError) {
        // Backend unavailable - use localStorage fallback
        console.log('Backend unavailable, using localStorage for password reset');
        const storedUsers = JSON.parse(localStorage.getItem('offline_users') || '[]');
        const userIndex = storedUsers.findIndex(u => u.email === resetEmail);

        if (userIndex === -1) {
          setMessage("No account found with this email address.");
          setIsLoading(false);
          return;
        }

        // Update password in localStorage
        storedUsers[userIndex].password = newPassword;
        localStorage.setItem('offline_users', JSON.stringify(storedUsers));

        setMessage("Password reset successful! You can now sign in with your new password.");
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail("");
          setNewPassword("");
          setConfirmPassword("");
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: theme.background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Enhanced Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: `radial-gradient(circle at 30% 20%, ${theme.accent}25 0%, ${theme.accentSecondary}15 40%, transparent 70%)`,
        borderRadius: "50%",
        animation: "float 20s ease-in-out infinite",
        filter: "blur(1px)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "5%",
        width: "250px",
        height: "250px",
        background: `radial-gradient(circle at 70% 80%, ${theme.accentSecondary}25 0%, ${theme.accent}15 40%, transparent 70%)`,
        borderRadius: "50%",
        animation: "float 25s ease-in-out infinite reverse",
        filter: "blur(1px)",
      }} />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        height: "400px",
        background: `conic-gradient(from 0deg, ${theme.accent}10, ${theme.accentSecondary}10, transparent, ${theme.accent}10)`,
        borderRadius: "50%",
        animation: "rotate 30s linear infinite",
        filter: "blur(2px)",
      }} />

      {/* Additional floating particles */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "20%",
        width: "8px",
        height: "8px",
        background: theme.accent,
        borderRadius: "50%",
        animation: "particle 15s ease-in-out infinite",
        boxShadow: `0 0 20px ${theme.accent}`,
      }} />
      <div style={{
        position: "absolute",
        bottom: "30%",
        left: "15%",
        width: "6px",
        height: "6px",
        background: theme.accentSecondary,
        borderRadius: "50%",
        animation: "particle 18s ease-in-out infinite reverse",
        boxShadow: `0 0 15px ${theme.accentSecondary}`,
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: `rgba(255, 255, 255, 0.1)`,
          backdropFilter: "blur(25px) saturate(180%)",
          WebkitBackdropFilter: "blur(25px) saturate(180%)",
          padding: "50px 40px",
          borderRadius: "25px",
          width: "400px",
          textAlign: "center",
          boxShadow: `0 25px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
          border: `1px solid rgba(255, 255, 255, 0.2)`,
          position: "relative",
          zIndex: 1,
          backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          style={{
            fontSize: "3rem",
            marginBottom: "20px",
            filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))",
          }}
        >
          {showForgotPassword ? "🔑" : isLogin ? "👋" : "✨"}
        </motion.div>
        <h2
          style={{
            fontSize: "2rem",
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "700",
            marginBottom: "10px",
            letterSpacing: "-0.5px",
          }}
        >
          {showForgotPassword ? "Reset Your Password" : isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p style={{
          fontSize: "0.95rem",
          color: theme.textSecondary,
          marginBottom: "30px",
          fontWeight: "500",
        }}>
          {showForgotPassword 
            ? "Enter your email and choose a new password" 
            : isLogin 
            ? "Sign in to continue your growth journey" 
            : "Start your journey to daily growth"}
        </p>

        {!showForgotPassword && (
          <>
            {!isLogin && (
              <motion.input
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileFocus={{ scale: 1.02, boxShadow: `0 0 0 3px ${theme.accent}30` }}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  marginBottom: "16px",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                  background: theme.cardBg,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                }}
              />
            )}

            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: `0 0 0 3px ${theme.accent}30` }}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "16px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.3s ease",
                fontWeight: "500",
                background: theme.cardBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
              }}
            />

            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: `0 0 0 3px ${theme.accent}30` }}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "16px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.3s ease",
                fontWeight: "500",
                background: theme.cardBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
              }}
            />
          </>
        )}

        {!showForgotPassword ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 10px 40px ${theme.accent}40` }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAuth}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                color: "#fff",
                fontWeight: "700",
                fontSize: "1.05rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                opacity: isLoading ? 0.7 : 1,
                boxShadow: `0 8px 25px ${theme.accent}30`,
              }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
                  Processing...
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </motion.button>

            {isLogin && (
              <motion.p
                whileHover={{ scale: 1.02 }}
                style={{
                  marginTop: "12px",
                  cursor: "pointer",
                  color: theme.textSecondary,
                  fontWeight: "500",
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  textAlign: "right",
                }}
                onClick={() => {
                  setShowForgotPassword(true);
                  setMessage("");
                  setResetEmail(email);
                }}
              >
                Forgot password?
              </motion.p>
            )}

            <motion.p
              whileHover={{ scale: 1.02, x: 5 }}
              style={{
                marginTop: "20px",
                cursor: "pointer",
                color: theme.accent,
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin ? "Don't have an account? Sign up →" : "Already have an account? Sign in →"}
            </motion.p>
          </>
        ) : (
          <>
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: `0 0 0 3px ${theme.accent}30` }}
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "16px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.3s ease",
                fontWeight: "500",
                background: theme.cardBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
              }}
            />

            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: `0 0 0 3px ${theme.accent}30` }}
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "16px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.3s ease",
                fontWeight: "500",
                background: theme.cardBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
              }}
            />

            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: `0 0 0 3px ${theme.accent}30` }}
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "16px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.3s ease",
                fontWeight: "500",
                background: theme.cardBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.border}`,
              }}
            />

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 10px 40px ${theme.accent}40` }}
              whileTap={{ scale: 0.95 }}
              onClick={handleForgotPassword}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                color: "#fff",
                fontWeight: "700",
                fontSize: "1.05rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                opacity: isLoading ? 0.7 : 1,
                boxShadow: `0 8px 25px ${theme.accent}30`,
              }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </motion.button>

            <motion.p
              whileHover={{ scale: 1.02, x: -5 }}
              style={{
                marginTop: "20px",
                cursor: "pointer",
                color: theme.accent,
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
              onClick={() => {
                setShowForgotPassword(false);
                setMessage("");
                setResetEmail("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              ← Back to Sign In
            </motion.p>
          </>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "10px",
              background: message.includes("sent") || message.includes("Check") 
                ? "rgba(34, 197, 94, 0.1)" 
                : "rgba(239, 68, 68, 0.1)",
              border: message.includes("sent") || message.includes("Check") 
                ? "1px solid rgba(34, 197, 94, 0.3)" 
                : "1px solid rgba(239, 68, 68, 0.3)",
              fontSize: "0.9rem",
              color: message.includes("sent") || message.includes("Check") 
                ? "#22c55e" 
                : "#ef4444",
              fontWeight: "500",
            }}
          >
            {message.includes("sent") || message.includes("Check") ? "✅" : "⚠️"} {message}
          </motion.div>
        )}
      </motion.div>

      {/* Floating Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-30px) translateX(5px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes particle {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
            25% { transform: translateY(-15px) scale(1.1); opacity: 1; }
            50% { transform: translateY(-5px) scale(0.9); opacity: 0.8; }
            75% { transform: translateY(-20px) scale(1.05); opacity: 0.9; }
          }
          @keyframes rotate {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Auth;             