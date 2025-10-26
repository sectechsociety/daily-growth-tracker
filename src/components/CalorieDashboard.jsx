import { useState, useEffect } from 'react';
import { Flame, Plus, X, Info } from 'lucide-react';

const CalorieDashboard = () => {
  const [goal, setGoal] = useState(2000);
  const [calories, setCalories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', time: '' });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedCalories = localStorage.getItem('calories');
    const savedGoal = localStorage.getItem('calorieGoal');
    
    if (savedCalories) setCalories(JSON.parse(savedCalories));
    if (savedGoal) setGoal(parseInt(savedGoal));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('calories', JSON.stringify(calories));
  }, [calories]);

  useEffect(() => {
    localStorage.setItem('calorieGoal', goal);
    setTempGoal(goal);
  }, [goal]);

  const totalCalories = calories.reduce((sum, meal) => sum + parseInt(meal.calories), 0);
  const remainingCalories = Math.max(0, goal - totalCalories);
  const progress = Math.min((totalCalories / goal) * 100, 100);

  const getProgressColor = () => {
    if (progress < 50) return 'from-green-400 to-emerald-500';
    if (progress < 80) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (newMeal.name && newMeal.calories) {
      const mealWithTime = {
        ...newMeal,
        time: newMeal.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCalories([...calories, mealWithTime]);
      setNewMeal({ name: '', calories: '', time: '' });
      setShowModal(false);
    }
  };

  const handleDeleteMeal = (index) => {
    const updatedCalories = [...calories];
    updatedCalories.splice(index, 1);
    setCalories(updatedCalories);
  };

  const saveGoal = () => {
    if (tempGoal > 0) {
      setGoal(tempGoal);
    }
    setIsEditingGoal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Main Card */}
      <div 
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="text-pink-400" />
            Calorie Tracker
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-200"
          >
            <Plus size={18} />
            Add Meal
          </button>
        </div>

        {/* Progress Ring */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeLinecap="round"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className={`transition-all duration-1000 ease-out transform -rotate-90 origin-center ${
                progress < 50 ? 'text-green-400' : progress < 80 ? 'text-yellow-400' : 'text-red-400'
              }`}
              style={{
                stroke: `url(#progressGradient)`,
                strokeLinecap: 'round',
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={progress < 50 ? '#4ade80' : progress < 80 ? '#facc15' : '#f87171'} />
                <stop offset="100%" stopColor={progress < 50 ? '#10b981' : progress < 80 ? '#f59e0b' : '#ef4444'} />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              className="text-3xl font-bold fill-white"
            >
              {Math.round(progress)}%
            </text>
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <span>Daily Goal</span>
              <Info size={14} className="opacity-60 hover:opacity-100 cursor-help" title="Your daily calorie target" />
            </div>
            {isEditingGoal ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                  className="bg-white/10 text-white w-20 p-1 rounded border border-white/20"
                  autoFocus
                />
                <button 
                  onClick={saveGoal}
                  className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    setTempGoal(goal);
                    setIsEditingGoal(false);
                  }}
                  className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div 
                className="text-2xl font-bold text-white cursor-pointer hover:bg-white/5 p-1 rounded"
                onClick={() => setIsEditingGoal(true)}
              >
                {goal.toLocaleString()} kcal
              </div>
            )}
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-gray-300 text-sm mb-1">Consumed</div>
            <div className="text-2xl font-bold text-white">
              {totalCalories.toLocaleString()} kcal
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-gray-300 text-sm mb-1">Remaining</div>
            <div className={`text-2xl font-bold ${
              remainingCalories < 0 ? 'text-red-400' : 'text-white'
            }`}>
              {remainingCalories.toLocaleString()} kcal
            </div>
          </div>
        </div>

        {/* Recent Meals */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Today's Meals</h3>
          {calories.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              No meals logged today. Click 'Add Meal' to get started!
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {calories.map((meal, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="font-medium text-white">{meal.name}</div>
                    <div className="text-xs text-gray-400">{meal.time}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">{meal.calories} kcal</span>
                    <button 
                      onClick={() => handleDeleteMeal(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      aria-label="Delete meal"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-md relative"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-6">Add New Meal</h3>
            
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  placeholder="e.g., Chicken Salad"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  placeholder="e.g., 350"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time (optional)
                </label>
                <input
                  type="time"
                  value={newMeal.time}
                  onChange={(e) => setNewMeal({...newMeal, time: e.target.value})}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              
              <button
                type="submit"
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                Add Meal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieDashboard;
