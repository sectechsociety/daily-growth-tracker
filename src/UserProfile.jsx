import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Edit, Save, Bell, Search, Filter } from "lucide-react";

function UserProfile({ user, setUser }) {
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    tasksCompleted: 0,
    totalXP: 0,
    joinDate: new Date().toLocaleDateString()
  });

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUserStats({
          level: storedUser.level || 1,
          xp: storedUser.xp || 0,
          streak: storedUser.streak || 0,
          tasksCompleted: storedUser.tasksCompleted || 0,
          totalXP: storedUser.xp || 0,
          joinDate: storedUser.joinDate || new Date().toLocaleDateString()
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserStats();
  }, [user]);

  const myProgress = [
    { name: "Active streak", description: `${userStats.streak} days`, status: "active", color: "#ef4444" },
    { name: "Paused goals", description: "Resume anytime", status: "blocked", color: "#10b981" }
  ];

  const myActivities = [
    { name: "Daily Tasks", status: "completed", count: userStats.tasksCompleted, color: "#10b981" },
    { name: "Weekly Goals", status: "completed", count: Math.floor(userStats.tasksCompleted / 7), color: "#10b981" },
    { name: "Level Progress", status: "completed", count: userStats.level, color: "#10b981" },
    { name: "Total XP Earned", status: "completed", count: userStats.totalXP, color: "#10b981" }
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: "64px",
            height: "64px",
            border: "4px solid #8b5cf6",
            borderTopColor: "transparent",
            borderRadius: "50%"
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      gap: "24px"
    }}>
      {/* Left Column - Profile Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          height: "fit-content"
        }}
      >
        {/* Profile Image */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "180px",
            height: "180px",
            margin: "0 auto",
            borderRadius: "16px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={80} color="white" />
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: "8px"
          }}>My profile</h2>
          <p style={{ fontSize: "14px", color: "#999", marginBottom: "24px" }}>
            Last login: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>

          {/* Contact Info */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0"
            }}>
              <span style={{ color: "#666", fontSize: "14px" }}>{user?.displayName || user?.name || "Growth Seeker"}</span>
              <span style={{ color: "#1a1a1a", fontWeight: "500", fontSize: "14px" }}>Level {userStats.level}</span>
            </div>
            <div style={{
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0"
            }}>
              <span style={{ color: "#666", fontSize: "14px" }}>{user?.email || "user@example.com"}</span>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "24px"
          }}>
            <span style={{ color: "#1a1a1a", fontSize: "14px", fontWeight: "500" }}>Notifications</span>
            <div
              onClick={() => setSmsAlerts(!smsAlerts)}
              style={{
                width: "48px",
                height: "24px",
                borderRadius: "12px",
                background: smsAlerts ? "#10b981" : "#e5e7eb",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              <motion.div
                animate={{ x: smsAlerts ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "2px",
                  left: "2px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <Save size={18} />
          Save
        </motion.button>
      </motion.div>

      {/* Right Column - Stats & Activities */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* My Progress Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a" }}>My Progress</h3>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                color: "#666"
              }}>
                <Search size={16} />
                Search
              </button>
              <button style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
                fontSize: "14px",
                color: "#666"
              }}>
                Edit
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {myProgress.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#f9fafb",
                  border: "1px solid #f0f0f0"
                }}
              >
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", marginBottom: "4px" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#999" }}>
                    {item.description}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "20px",
                    border: "none",
                    background: item.status === "active" ? item.color : "#10b981",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {item.status === "active" ? "Active" : "Resume"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* My Activities Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a" }}>My Activities</h3>
            <button style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              color: "#666"
            }}>
              <Filter size={16} />
              Filter by
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#f9fafb",
                  border: "1px solid #f0f0f0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: activity.color
                  }} />
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>
                    {activity.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border: "none",
                    background: activity.color,
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {activity.count} {activity.status === "completed" ? "✓" : ""}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default UserProfile;
