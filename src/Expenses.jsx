import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const Expenses = () => {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentView, setCurrentView] = useState('DAY');
  const [dailySavingsTarget, setDailySavingsTarget] = useState(50);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Day');
  const [selectedBar, setSelectedBar] = useState(null);

  const categories = [
    { id: 'travel', name: 'Travel', icon: '✈️', color: '#8B7FC7' },
    { id: 'food', name: 'Food', icon: '🍔', color: '#8B7FC7' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8B7FC7' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#8B7FC7' },
    { id: 'bills', name: 'Bills', icon: '📄', color: '#8B7FC7' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#8B7FC7' },
    { id: 'health', name: 'Health', icon: '⚕️', color: '#8B7FC7' },
    { id: 'education', name: 'Education', icon: '📚', color: '#8B7FC7' },
    { id: 'personal', name: 'Personal', icon: '👤', color: '#8B7FC7' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#8B7FC7' },
    { id: 'clothing', name: 'Clothing', icon: '👕', color: '#8B7FC7' },
    { id: 'beauty', name: 'Beauty', icon: '💄', color: '#8B7FC7' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: '#8B7FC7' },
    { id: 'gifts', name: 'Gifts', icon: '🎁', color: '#8B7FC7' },
    { id: 'pets', name: 'Pets', icon: '🐾', color: '#8B7FC7' },
    { id: 'home', name: 'Home', icon: '🏠', color: '#8B7FC7' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#8B7FC7' },
    { id: 'taxes', name: 'Taxes', icon: '💰', color: '#8B7FC7' },
    { id: 'charity', name: 'Charity', icon: '❤️', color: '#8B7FC7' },
    { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: '#8B7FC7' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧', color: '#8B7FC7' },
    { id: 'electronics', name: 'Electronics', icon: '💻', color: '#8B7FC7' },
    { id: 'hobbies', name: 'Hobbies', icon: '🎨', color: '#8B7FC7' },
    { id: 'childcare', name: 'Childcare', icon: '👶', color: '#8B7FC7' },
  ];

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedIncome = localStorage.getItem('income');
    const savedCustomCategories = localStorage.getItem('customCategories');
    const savedDailyTarget = localStorage.getItem('dailySavingsTarget');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedIncome) setIncome(parseFloat(savedIncome));
    if (savedCustomCategories) setCustomCategories(JSON.parse(savedCustomCategories));
    if (savedDailyTarget) setDailySavingsTarget(parseFloat(savedDailyTarget));
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleAddExpense = () => {
    if (!expenseAmount || parseFloat(expenseAmount) <= 0) return;

    const newExpense = {
      id: Date.now(),
      category: selectedCategory.id,
      categoryName: selectedCategory.name,
      amount: parseFloat(expenseAmount),
      notes: expenseNotes,
      date: expenseDate,
      timestamp: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // Check savings achievement
    const totalExpense = getTotalExpense(updatedExpenses);
    const savings = income - totalExpense;
    if (savings >= dailySavingsTarget && income > 0) {
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 4000);
    }

    setShowModal(false);
    setExpenseAmount('');
    setExpenseNotes('');
    setExpenseDate(new Date().toISOString().split('T')[0]);
  };

  const getTotalExpense = (expenseList = expenses) => {
    return expenseList.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getBalance = () => {
    return income - getTotalExpense();
  };

  const getCategoryExpenses = () => {
    const categoryTotals = {};
    expenses.forEach(exp => {
      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }
      categoryTotals[exp.category] += exp.amount;
    });
    return categoryTotals;
  };

  const getTotalSaved = () => {
    const balance = getBalance();
    return balance > 0 ? balance : 0;
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      setExpenses([]);
      setIncome(0);
      localStorage.removeItem('expenses');
      localStorage.removeItem('income');
    }
  };

  const handleAddCustomCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = {
      id: `custom_${Date.now()}`,
      name: newCategoryName,
      icon: newCategoryIcon || '📦',
      color: '#8B7FC7',
    };
    const updatedCustomCategories = [...customCategories, newCategory];
    setCustomCategories(updatedCustomCategories);
    localStorage.setItem('customCategories', JSON.stringify(updatedCustomCategories));
    setShowAddCategoryModal(false);
    setNewCategoryName('');
    setNewCategoryIcon('');
  };

  const allCategories = [...categories, ...customCategories];

  const getExpensesByTimePeriod = () => {
    const now = new Date();
    const filtered = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const timeDiff = now - expDate;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      switch(selectedTimePeriod) {
        case 'Day':
          return daysDiff < 1;
        case 'Week':
          return daysDiff < 7;
        case 'Month':
          return daysDiff < 30;
        case 'Year':
          return daysDiff < 365;
        default:
          return true;
      }
    });
    return filtered.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const data = months.map((month, index) => {
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getFullYear() === currentYear && expDate.getMonth() === index;
      }).reduce((sum, exp) => sum + exp.amount, 0);
      
      // Mock income data - in real app, this would come from income records
      const monthIncome = income / 12; // Simple division for demo
      
      return { month, expense: monthExpenses, income: monthIncome };
    });
    return data;
  };

  const checkDailyTarget = () => {
    const todayExpenses = getExpensesByTimePeriod();
    const todaySavings = income - todayExpenses;
    return todaySavings >= dailySavingsTarget;
  };

  const getCategoryChartData = () => {
    const categoryExpenses = getCategoryExpenses();
    const totalExpense = getTotalExpense();
    
    return Object.entries(categoryExpenses)
      .map(([categoryId, amount]) => {
        const category = allCategories.find(c => c.id === categoryId);
        const percentage = totalExpense > 0 ? (amount / totalExpense * 100).toFixed(1) : 0;
        return {
          id: categoryId,
          name: category?.name || 'Unknown',
          icon: category?.icon || '📦',
          amount,
          percentage,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 7);
  };

  const viewOptions = ['DAY', 'WEEK', 'MONTH', 'YEAR'];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          marginBottom: '20px',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '12px',
        }}>
          {/* Add Category Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddCategoryModal(true)}
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(139, 127, 199, 0.15)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '6px',
              color: '#8B7FC7',
            }}>
              +
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#2D3748',
            }}>
              Add
            </div>
          </motion.div>
          
          {allCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.05, background: 'rgba(139, 127, 199, 0.25)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(139, 127, 199, 0.15)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                fontSize: '2rem',
                marginBottom: '6px',
              }}>
                {category.icon}
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#2D3748',
              }}>
                {category.name}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Income & Expense Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'rgba(139, 127, 199, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          border: '2px solid rgba(139, 127, 199, 0.2)',
          marginBottom: '16px',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#2D3748',
            margin: 0,
          }}>
            Financial Overview
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#EF4444',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Reset
          </motion.button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(139, 127, 199, 0.2)',
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#718096',
              marginBottom: '4px',
              fontWeight: '600',
            }}>
              Total Income
            </div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#10B981',
            }}>
              ₹{income.toFixed(2)}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newIncome = prompt('Enter your income:', income);
                if (newIncome && !isNaN(newIncome)) {
                  setIncome(parseFloat(newIncome));
                  localStorage.setItem('income', newIncome);
                }
              }}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: '#8B7FC7',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Update
            </motion.button>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(139, 127, 199, 0.2)',
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#718096',
              marginBottom: '4px',
              fontWeight: '600',
            }}>
              Total Expense
            </div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#EF4444',
            }}>
              ₹{getTotalExpense().toFixed(2)}
            </div>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(139, 127, 199, 0.2)',
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#718096',
              marginBottom: '4px',
              fontWeight: '600',
            }}>
              Balance
            </div>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: getBalance() >= 0 ? '#8B7FC7' : '#EF4444',
            }}>
              ₹{getBalance().toFixed(2)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, rgba(139, 127, 199, 0.15), rgba(167, 139, 250, 0.15))',
          borderRadius: '20px',
          padding: '24px',
          border: 'none',
          marginBottom: '16px',
        }}
      >
        <h2 style={{
          fontSize: '1.3rem',
          fontWeight: '700',
          color: '#2D3748',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          Analytics
        </h2>

        {/* Bar Chart */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          {expenses.length > 0 ? (
            <>
              {/* Selected Category Info */}
              {selectedBar && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: '16px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, rgba(139, 127, 199, 0.1), rgba(167, 139, 250, 0.1))',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{selectedBar.icon}</span>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#2D3748',
                    }}>
                      {selectedBar.name}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#8B7FC7',
                  }}>
                    {selectedBar.percentage}%
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#718096',
                  }}>
                    ₹{selectedBar.amount.toFixed(2)}
                  </div>
                </motion.div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '200px',
                gap: '8px',
                position: 'relative',
                paddingLeft: '30px',
              }}>
                {/* Y-axis labels */}
                <div style={{
                  position: 'absolute',
                  left: '0',
                  top: 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: '#718096',
                }}>
                  <div>₹{Math.max(...getCategoryChartData().map(d => d.amount)).toFixed(0)}</div>
                  <div>₹{(Math.max(...getCategoryChartData().map(d => d.amount)) * 0.66).toFixed(0)}</div>
                  <div>₹{(Math.max(...getCategoryChartData().map(d => d.amount)) * 0.33).toFixed(0)}</div>
                  <div>₹0</div>
                </div>

                {getCategoryChartData().map((category, index) => {
                  const maxValue = Math.max(...getCategoryChartData().map(d => d.amount), 1);
                  const barHeight = (category.amount / maxValue) * 100;
                  const isSelected = selectedBar?.id === category.id;
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedBar(isSelected ? null : category)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        height: '170px',
                      }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ 
                            height: `${barHeight}%`,
                            opacity: isSelected ? 1 : 0.8,
                          }}
                          whileHover={{ opacity: 1, scale: 1.05 }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          style={{
                            width: '24px',
                            background: isSelected 
                              ? 'linear-gradient(180deg, #8B7FC7, #A78BFA)'
                              : 'linear-gradient(180deg, #A0AEC0, #CBD5E0)',
                            borderRadius: '8px 8px 0 0',
                            minHeight: '8px',
                            boxShadow: isSelected ? '0 4px 12px rgba(139, 127, 199, 0.4)' : 'none',
                          }}
                        />
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.3s',
                      }}>
                        {category.icon}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#718096',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📊</div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                No expenses yet
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                Start tracking your expenses to see analytics
              </div>
            </div>
          )}
        </div>

        {/* Income and Expense Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(139, 127, 199, 0.1)',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(139, 127, 199, 0.2), rgba(167, 139, 250, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}>
              🐷
            </div>
            <div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#2D3748',
              }}>
                ₹{income.toFixed(0)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#718096',
                fontWeight: '600',
              }}>
                Income
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(160, 174, 192, 0.1)',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(160, 174, 192, 0.2), rgba(203, 213, 224, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}>
              📄
            </div>
            <div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#2D3748',
              }}>
                ₹{getTotalExpense().toFixed(0)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#718096',
                fontWeight: '600',
              }}>
                Expenses
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Daily Savings Target */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          background: checkDailyTarget() 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15))'
            : 'rgba(139, 127, 199, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          border: `2px solid ${checkDailyTarget() ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 127, 199, 0.2)'}`,
          marginBottom: '16px',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#2D3748',
            margin: 0,
          }}>
            Daily Savings Target
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const newTarget = prompt('Set daily savings target:', dailySavingsTarget);
              if (newTarget && !isNaN(newTarget)) {
                setDailySavingsTarget(parseFloat(newTarget));
                localStorage.setItem('dailySavingsTarget', newTarget);
              }
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#8B7FC7',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Update
          </motion.button>
        </div>
        <div style={{
          marginTop: '12px',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(139, 127, 199, 0.2)',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#8B7FC7',
            marginBottom: '8px',
          }}>
            ₹{dailySavingsTarget.toFixed(2)}
          </div>
          {checkDailyTarget() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#10B981',
                fontSize: '0.85rem',
                fontWeight: '600',
              }}
            >
              🎉 Target achieved today! Great job!
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Add Custom Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
              padding: '20px',
            }}
            onClick={() => setShowAddCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '24px',
                padding: '30px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(139, 127, 199, 0.2)',
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#2D3748',
                marginBottom: '20px',
              }}>
                Add Custom Category
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Coffee, Books, etc."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#2D3748',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  placeholder="☕ (paste emoji here)"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#2D3748',
                    fontSize: '1.5rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddCategoryModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.3)',
                    background: 'transparent',
                    color: '#718096',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(139, 127, 199, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddCustomCategory}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8B7FC7, #A78BFA)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 127, 199, 0.3)',
                  }}
                >
                  Add Category
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
              padding: '20px',
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '24px',
                padding: '30px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(139, 127, 199, 0.2)',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '2rem' }}>{selectedCategory?.icon}</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#2D3748',
                  margin: 0,
                }}>
                  Add {selectedCategory?.name} Expense
                </h3>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Amount *
                </label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#2D3748',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#2D3748',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Date
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.2)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: '#2D3748',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 127, 199, 0.3)',
                    background: 'transparent',
                    color: '#718096',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(139, 127, 199, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddExpense}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8B7FC7, #A78BFA)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 127, 199, 0.3)',
                  }}
                >
                  Add Expense
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              background: 'linear-gradient(135deg, #10B981, #34D399)',
              borderRadius: '20px',
              padding: '24px 30px',
              boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4)',
              zIndex: 1001,
              maxWidth: '400px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                style={{ fontSize: '3rem' }}
              >
                🎉
              </motion.div>
              <div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '4px',
                }}>
                  Savings Goal Achieved!
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}>
                  Great job! Keep up the excellent work! 💪
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          h1 {
            font-size: 1.3rem !important;
          }
          h2 {
            font-size: 1rem !important;
          }
        }

        @media (max-width: 600px) {
          div[style*="repeat(auto-fit, minmax(80px, 1fr))"] {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }

        @media (max-width: 400px) {
          div[style*="repeat(auto-fit, minmax(80px, 1fr))"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        input, textarea {
          box-sizing: border-box;
        }

        input:focus, textarea:focus {
          border-color: #8B7FC7 !important;
        }
      `}</style>
    </div>
  );
};

export default Expenses;
