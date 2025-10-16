import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Utensils, Flame } from 'lucide-react';

export default function CalorieTracker() {
  const [isOpen, setIsOpen] = useState(false);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [goal] = useState(2000);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const dropdownRef = useRef(null);

  const progress = Math.min((caloriesConsumed / goal) * 100, 100);
  const remainingCalories = Math.max(0, goal - caloriesConsumed);

  const getProgressColor = () => {
    if (progress < 50) return 'from-green-400 to-emerald-500';
    if (progress < 80) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (mealName && mealCalories) {
      setCaloriesConsumed(prev => prev + parseInt(mealCalories));
      setMealName('');
      setMealCalories('');
      setShowAddForm(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      >
        <Flame className="w-5 h-5 text-pink-400" />
        <span>Calories</span>
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white/5 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Calorie Tracker</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 rounded-full hover:bg-white/10 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Consumed</span>
                    <span className="font-medium text-white">
                      {caloriesConsumed} <span className="text-gray-400">/ {goal} kcal</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-xs text-right text-gray-400">
                    {remainingCalories} kcal remaining
                  </div>
                </div>

                {!showAddForm ? (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Meal
                  </button>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddMeal}
                    className="space-y-3"
                  >
                    <div>
                      <input
                        type="text"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        placeholder="Meal name"
                        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={mealCalories}
                        onChange={(e) => setMealCalories(e.target.value)}
                        placeholder="Calories"
                        className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        min="1"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      >
                        Add
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
