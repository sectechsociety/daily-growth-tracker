import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CalorieTracker from "./components/CalorieTracker";

function Navbar() {
    const navStyle = {
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        padding: "16px 40px",
        marginBottom: "20px",
        backdropFilter: "blur(20px) saturate(180%)",
        background: "rgba(22, 22, 22, 0.7)", // Darker background for the theme
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    };

    const linkStyle = {
        fontWeight: 600,
        color: "#e8e8e8", // Lighter text for dark theme
        textDecoration: "none",
        fontSize: "1rem",
        transition: "color 0.3s ease",
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={navStyle}
        >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Link
                    to="/"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = "#7b2ff7")}
                    onMouseLeave={(e) => (e.target.style.color = "#e8e8e8")}
                >
                    🏠 Dashboard
                </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Link
                    to="/profile"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = "#7b2ff7")}
                    onMouseLeave={(e) => (e.target.style.color = "#e8e8e8")}
                >
                    👤 Profile
                </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Link
                    to="/leaderboard"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = "#7b2ff7")}
                    onMouseLeave={(e) => (e.target.style.color = "#e8e8e8")}
                >
                    🏆 Leaderboard
                </Link>
            </motion.div>

            <CalorieTracker />

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Link
                    to="/adventure"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = "#7b2ff7")}
                    onMouseLeave={(e) => (e.target.style.color = "#e8e8e8")}
                >
                    🗺️ Adventure Map
                </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Link
                    to="/game"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = "#7b2ff7")}
                    onMouseLeave={(e) => (e.target.style.color = "#e8e8e8")}
                >
                    🎮 Game
                </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Link
                    to="/ai-assistant"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = "#7b2ff7")}
                    onMouseLeave={(e) => (e.target.style.color = "#e8e8e8")}
                >
                    ✨ AI Assistant
                </Link>
            </motion.div>
        </motion.nav>
    );
}

export default Navbar;

