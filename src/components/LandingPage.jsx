
import React from "react";
import { useNavigate } from "react-router-dom";
import bgForest from "../assets/forest-bg.jpg"; // add your background image to src/assets
import heroSprite from "../assets/hero.png";     // optional character sprite
import spider from "../assets/spider.png";       // optional pixel assets
import bat from "../assets/bat.png";             // optional pixel assets
import sideIllustration from "../assets/side-illustration.png"; // side illustration
import ThemeToggle from "../src/components/ThemeToggle";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login"); // route to your login page
  };

  const categories = [
    { name: "HEALTH", color: "#FF595E", progress: 0.7 },
    { name: "FINANCIAL", color: "#FFCA3A", progress: 0.4 },
    { name: "KNOWLEDGE", color: "#8AC926", progress: 0.9 },
    { name: "RELATIONSHIPS", color: "#1982C4", progress: 0.5 },
  ];

  return (
    <div
      className="relative flex min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgForest})` }}
    >
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Floating decorative sprites (optional) */}
      <img
        src={bat}
        alt="bat"
        className="absolute top-10 left-20 w-20 animate-bounce opacity-80 z-10"
      />
      <img
        src={spider}
        alt="spider"
        className="absolute bottom-40 left-10 w-14 animate-pulse opacity-80 z-10"
      />
      <img
        src={heroSprite}
        alt="hero"
        className="absolute bottom-20 left-10 w-28 opacity-90 z-10"
      />

      {/* Two column layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-8 py-12">
        
        {/* Left side - Main content */}
        <div className="flex-1 text-center lg:text-left lg:pr-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            Gamify your life
          </h1>
          <p className="text-gray-200 mt-4 max-w-lg text-lg">
            Discover the best gamification tools to motivate yourself to achieve
            your goals.
          </p>

          {/* Quest box */}
          <div className="mt-10 bg-gray-800/70 border border-purple-400/40 rounded-xl p-4 flex items-center gap-4 max-w-md shadow-lg">
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-1">Your next quest</p>
              <p className="text-white font-semibold text-lg">
                Learn the basics of flying a plane
              </p>
            </div>
            <button
              onClick={handleStart}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
            >
              START
            </button>
          </div>

          {/* Explore text */}
          <p className="text-gray-400 mt-6">
            Or explore <span className="text-purple-400 font-semibold">574</span>{" "}
            gamification apps →
          </p>

          {/* XP/Health bars */}
          <div className="mt-12 flex flex-col gap-2 max-w-xl">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>{cat.name}</span>
                  <span>{Math.round(cat.progress * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${cat.progress * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="flex-shrink-0 mt-12 lg:mt-0">
          <img
            src={sideIllustration}
            alt="Person working on laptop"
            className="w-80 lg:w-96 drop-shadow-2xl animate-float"
          />
        </div>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

