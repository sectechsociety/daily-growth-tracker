// src/AdventureMap.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FiTarget, FiStar, FiZap, FiAward, FiTrendingUp, 
  FiShoppingBag, FiUsers, FiPlay 
} from "react-icons/fi";

// Parallax Star Component
const Star = ({ size, top, left, duration }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    style={{
      width: size,
      height: size,
      top: `${top}%`,
      left: `${left}%`,
    }}
    animate={{
      opacity: [0.2, 1, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Interactive Checkpoint Component
const Checkpoint = ({ checkpoint, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        top: checkpoint.position.top,
        left: checkpoint.position.left,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(checkpoint.route)}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: checkpoint.color }}
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Checkpoint Node */}
      <motion.div
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, ${checkpoint.color}, ${checkpoint.colorSecondary})`,
          boxShadow: `0 0 30px ${checkpoint.color}`,
        }}
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <checkpoint.icon className="text-white text-2xl md:text-3xl" />
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 whitespace-nowrap"
          >
            <p className="text-white font-bold text-sm">{checkpoint.title}</p>
            <p className="text-gray-300 text-xs">{checkpoint.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connecting Line to Next Checkpoint */}
      {checkpoint.nextPosition && (
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <motion.line
            x1="50%"
            y1="50%"
            x2={checkpoint.nextPosition.x}
            y2={checkpoint.nextPosition.y}
            stroke={checkpoint.color}
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
          />
        </svg>
      )}
    </motion.div>
  );
};

function AdventureMap() {
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Define interactive checkpoints
  const checkpoints = [
    {
      id: 1,
      title: "Training Grounds",
      description: "Start your journey",
      icon: FiTarget,
      color: "#22c55e",
      colorSecondary: "#16a34a",
      position: { top: "20%", left: "15%" },
      route: "/game",
    },
    {
      id: 2,
      title: "Level Progression",
      description: "Track your growth",
      icon: FiTrendingUp,
      color: "#a855f7",
      colorSecondary: "#7c3aed",
      position: { top: "35%", left: "35%" },
      route: "/levels",
    },
    {
      id: 3,
      title: "Hall of Legends",
      description: "View rankings",
      icon: FiAward,
      color: "#fbbf24",
      colorSecondary: "#f59e0b",
      position: { top: "50%", left: "50%" },
      route: "/leaderboard",
    },
    {
      id: 4,
      title: "Cosmic Arena",
      description: "Test your skills",
      icon: FiPlay,
      color: "#ec4899",
      colorSecondary: "#db2777",
      position: { top: "35%", left: "65%" },
      route: "/game",
    },
    {
      id: 5,
      title: "AI Oracle",
      description: "Seek guidance",
      icon: FiZap,
      color: "#06b6d4",
      colorSecondary: "#0891b2",
      position: { top: "65%", left: "30%" },
      route: "/ai-assistant",
    },
    {
      id: 6,
      title: "Treasure Vault",
      description: "Collect rewards",
      icon: FiStar,
      color: "#f59e0b",
      colorSecondary: "#d97706",
      position: { top: "70%", left: "70%" },
      route: "/profile",
    },
  ];

  // Generate random stars for parallax effect
  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generatedStars);
  }, []);

  // Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCheckpointClick = (route) => {
    navigate(route);
  };

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 1,
      },
    },
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Google Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
        rel="stylesheet"
      />

      {/* Parallax Starfield Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        {stars.map((star) => (
          <Star
            key={star.id}
            size={star.size}
            top={star.top}
            left={star.left}
            duration={star.duration}
          />
        ))}
      </motion.div>

      {/* Animated Nebula Clouds */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-3xl rounded-full"
          style={{ top: "10%", left: "10%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full"
          style={{ bottom: "10%", right: "10%" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full"
          style={{ top: "50%", left: "50%" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Interactive Checkpoints */}
      <div className="absolute inset-0 z-10">
        {checkpoints.map((checkpoint, index) => (
          <Checkpoint
            key={checkpoint.id}
            checkpoint={checkpoint}
            index={index}
            onClick={handleCheckpointClick}
          />
        ))}
      </div>


      {/* Center Title and Instructions */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4">
        {/* Animated Title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-wider text-center"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)",
          }}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">
            COSMIC ODYSSEY
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-2xl text-cyan-300 mb-12 text-center max-w-2xl"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 10px rgba(34, 211, 238, 0.6)",
          }}
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Navigate the stars • Complete missions • Ascend to legend
        </motion.p>

        {/* Instructions Card */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-6 md:p-8 max-w-md pointer-events-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h3
            className="text-2xl font-bold mb-4 text-center text-cyan-300"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Mission Control
          </h3>
          <p className="text-gray-300 text-center mb-6">
            Click on any checkpoint to begin your journey through the cosmos
          </p>

          {/* Legend */}
          <div className="space-y-3 text-sm">
            {checkpoints.slice(0, 3).map((cp) => (
              <div key={cp.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${cp.color}, ${cp.colorSecondary})`,
                    boxShadow: `0 0 15px ${cp.color}`,
                  }}
                >
                  <cp.icon className="text-white text-sm" />
                </div>
                <span className="text-gray-200">{cp.title}</span>
              </div>
            ))}
            <p className="text-gray-400 text-xs text-center mt-4">
              ...and {checkpoints.length - 3} more destinations
            </p>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="mt-6 w-full py-3 rounded-xl font-bold text-white relative overflow-hidden pointer-events-auto"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: "linear-gradient(135deg, #a855f7, #06b6d4)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(168, 85, 247, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative z-10">Return to Dashboard</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        * {
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
    </div>
  );
}

export default AdventureMap;