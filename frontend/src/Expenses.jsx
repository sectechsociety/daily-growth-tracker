/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useToast } from './components/hooks/use-toast';

// --- React Icon Imports ---
import {
  FiSend, FiCoffee, FiShoppingBag, FiShoppingCart, FiFileText, FiPlay, FiHeart, 
  FiBookOpen, FiUser, FiTruck, FiSmile, FiAward, FiGift, FiGithub, FiHome, 
  FiShield, FiPaperclip, FiSmartphone, FiTool, FiCpu, FiEdit, FiPackage, 
  FiThumbsUp, FiTrendingUp, FiTrendingDown, FiPlus, FiX, FiCheckCircle,
  FiTarget, FiCalendar, FiAlertTriangle // Added new icons
} from 'react-icons/fi';

// --- Expenses component now accepts `addXP` ---
const Expenses = ({ addXP }) => {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentView, setCurrentView] = useState('DAY');
  const [dailySavingsTarget, setDailySavingsTarget] = useState(500); // Defaulting to your 500
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Day');
  const [selectedBar, setSelectedBar] = useState(null);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseEditAmount, setExpenseEditAmount] = useState('');
  const [expenseEditNotes, setExpenseEditNotes] = useState('');
  const [expenseEditDate, setExpenseEditDate] = useState(new Date().toISOString().split('T')[0]);

  const { toast } = useToast();
  const goalToastRef = useRef(null);
  const lastGoalSnapshotRef = useRef(null);

  const showToast = (type, payload) => {
    if (toast && type && typeof toast[type] === 'function') {
      return toast[type](payload);
    } else if (typeof toast === 'function') {
      return toast(payload);
    }
    return null;
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthLabel = today.toLocaleString('default', { month: 'long' });

  const monthlyExpenses = expenses.reduce((sum, exp) => {
    const expDate = new Date(exp.date);
    if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
      return sum + exp.amount;
    }
    return sum;
  }, 0);

  const monthlySavingsGoal = dailySavingsTarget * daysInMonth;
  const monthlySavingsActual = income - monthlyExpenses;
  const formattedMonthlyGoal = monthlySavingsGoal.toFixed(2);
  const formattedMonthlyActual = monthlySavingsActual.toFixed(2);
  const formattedDailyTarget = dailySavingsTarget.toFixed(2);
  const rawRemainingToGoal = monthlySavingsGoal - monthlySavingsActual;
  const rawSurplusToGoal = monthlySavingsActual - monthlySavingsGoal;
  const isMonthlyGoalMet = rawSurplusToGoal >= 0;
  const formattedRemainingToGoal = rawRemainingToGoal > 0 ? rawRemainingToGoal.toFixed(2) : '0.00';
  const formattedSurplusToGoal = rawSurplusToGoal > 0 ? rawSurplusToGoal.toFixed(2) : '0.00';

  // --- Categories array now uses React Icons ---
  const categories = [
    { id: 'travel', name: 'Travel', icon: <FiSend size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'food', name: 'Food', icon: <FiCoffee size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'shopping', name: 'Shopping', icon: <FiShoppingBag size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'groceries', name: 'Groceries', icon: <FiShoppingCart size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'bills', name: 'Bills', icon: <FiFileText size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'entertainment', name: 'Entertainment', icon: <FiPlay size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'health', name: 'Health', icon: <FiHeart size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'education', name: 'Education', icon: <FiBookOpen size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'personal', name: 'Personal', icon: <FiUser size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'transport', name: 'Transport', icon: <FiTruck size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'clothing', name: 'Clothing', icon: <FiShoppingBag size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'beauty', name: 'Beauty', icon: <FiSmile size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'sports', name: 'Sports', icon: <FiAward size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'gifts', name: 'Gifts', icon: <FiGift size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'pets', name: 'Pets', icon: <FiGithub size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'home', name: 'Home', icon: <FiHome size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'insurance', name: 'Insurance', icon: <FiShield size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'taxes', name: 'Taxes', icon: <FiPaperclip size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'charity', name: 'Charity', icon: <FiHeart size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'subscriptions', name: 'Subscriptions', icon: <FiSmartphone size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'maintenance', name: 'Maintenance', icon: <FiTool size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'electronics', name: 'Electronics', icon: <FiCpu size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'hobbies', name: 'Hobbies', icon: <FiEdit size={32} color="#8B7FC7" />, color: '#8B7FC7' },
    { id: 'childcare', name: 'Childcare', icon: <FiSmile size={32} color="#8B7FC7" />, color: '#8B7FC7' },
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

  // --- UPDATED: `handleAddExpense` ---
  // --- Removed all XP logic from this function ---
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

    // Clear form
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
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    setExpenses([]);
    setIncome(0);
    setDailySavingsTarget(0);
    localStorage.removeItem('expenses');
    localStorage.removeItem('income');
    localStorage.removeItem('dailySavingsTarget');
    setIsResetConfirmOpen(false);
    showToast('info', {
      title: 'Data reset',
      description: 'Income, expenses, and savings target cleared.',
      duration: 4000,
    });
  };

  const cancelReset = () => {
    setIsResetConfirmOpen(false);
  };

  const openIncomeModal = () => {
    setIncomeInput(income ? income.toString() : '');
    setIsIncomeModalOpen(true);
  };

  const closeIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setIncomeInput('');
  };

  const handleIncomeSave = () => {
    const parsed = Number.parseFloat(incomeInput);

    if (!Number.isFinite(parsed) || parsed < 0) {
      showToast('warning', {
        title: 'Invalid income value',
        description: 'Please enter a non-negative number for your income.',
        duration: 4000,
      });
      return;
    }
    setIncome(parsed);
    localStorage.setItem('income', parsed.toString());
    closeIncomeModal();

    showToast('success', {
      title: 'Income updated',
      description: `New income set to ₹${parsed.toFixed(2)}.`,
      duration: 4000,
    });
  };

  const openTargetModal = () => {
    setTargetInput(dailySavingsTarget ? dailySavingsTarget.toString() : '');
    setIsTargetModalOpen(true);
  };

  const closeTargetModal = () => {
    setIsTargetModalOpen(false);
    setTargetInput('');
  };

  const handleTargetSave = () => {
    const parsed = Number.parseFloat(targetInput);

    if (!Number.isFinite(parsed) || parsed < 0) {
      showToast('warning', {
        title: 'Invalid savings target',
        description: 'Please enter a non-negative number for your daily savings target.',
        duration: 4000,
      });
      return;
    }
    setDailySavingsTarget(parsed);
    localStorage.setItem('dailySavingsTarget', parsed.toString());
    closeTargetModal();

    showToast('success', {
      title: 'Daily target updated',
      description: `Your daily savings target is now ₹${parsed.toFixed(2)}.`,
      duration: 4000,
    });
  };

  const handleAddCustomCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = {
      id: `custom_${Date.now()}`,
      name: newCategoryName,
      icon: <FiPackage size={32} color="#8B7FC7" />, // Default icon
      color: '#8B7FC7',
    };
    
    // Check if user provided an icon name (basic check)
    if (newCategoryIcon.trim()) {
      // This is a simple way; a real app might use a dynamic import or mapping
      newCategory.icon = <FiPackage size={32} color="#8B7FC7" />
    }

    const updatedCustomCategories = [...customCategories, newCategory];
    setCustomCategories(updatedCustomCategories);
    localStorage.setItem('customCategories', JSON.stringify(updatedCustomCategories));
    setShowAddCategoryModal(false);
    setNewCategoryName('');
    setNewCategoryIcon('');
  };

  const allCategories = [...categories, ...customCategories];

  // This function now filters for the CURRENTLY selected time period (Day, Week, Month)
  const getExpensesByTimePeriod = (expenseList = expenses) => {
    const now = new Date();
    const filtered = expenseList.filter(exp => {
      const expDate = new Date(exp.date);
      const timeDiff = now - expDate;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      switch(selectedTimePeriod) {
        case 'Day':
          return expDate.toDateString() === now.toDateString();
        case 'Week':
          return daysDiff < 7;
        case 'Month':
          return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
        case 'Year':
          return expDate.getFullYear() === now.getFullYear();
        default:
          return true; // Should not happen
      }
    });
    return filtered.reduce((sum, exp) => sum + exp.amount, 0);
  };

  // --- NEW: Function to check monthly savings and award XP ---
  const handleCheckMonthlySavings = () => {
    const bonusFlagKey = `monthlySavingsBonus_${currentYear}_${currentMonth}`;
    const alreadyAwarded = localStorage.getItem(bonusFlagKey);
    const formattedActual = monthlySavingsActual.toFixed(2);
    const formattedGoal = monthlySavingsGoal.toFixed(2);

    if (alreadyAwarded) {
      showToast('info', {
        title: 'Bonus already claimed',
        description: `Great job! You've already claimed this month's reward. Monthly savings: ₹${formattedActual}.`,
        duration: 5000,
      });
      return;
    }

    if (monthlySavingsActual >= monthlySavingsGoal) {
      if (addXP) {
        addXP('monthlySavingsGoal', 500);
        localStorage.setItem(bonusFlagKey, 'true');
        showToast('success', {
          title: 'Monthly goal achieved! 🎉',
          description: `You saved ₹${formattedActual} this month and earned 500 XP. Keep building that momentum!`,
          duration: 6000,
        });
      } else {
        showToast('info', {
          title: 'Monthly goal achieved!',
          description: `You saved ₹${formattedActual} this month. (XP reward unavailable in this context)`,
          duration: 6000,
        });
      }
    } else {
      const needed = (monthlySavingsGoal - monthlySavingsActual).toFixed(2);
      showToast('warning', {
        title: 'Keep going!',
        description: `Monthly savings so far: ₹${formattedActual}. You need ₹${needed} more to reach ₹${formattedGoal}.`,
        duration: 6000,
      });
    }
  };

  // (getMonthlyData and getCategoryChartData are unchanged)
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const data = months.map((month, index) => {
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getFullYear() === currentYear && expDate.getMonth() === index;
      }).reduce((sum, exp) => sum + exp.amount, 0);
      
      const monthIncome = income / 12; // Simple division for demo
      
      return { month, expense: monthExpenses, income: monthIncome };
    });
    return data;
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
          icon: category?.icon || <FiPackage size={20} color="#2D3748" />, // Use icon component
          amount,
          percentage,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 7);
  };

  const viewOptions = ['Day', 'Week', 'Month', 'Year'];

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  const buildGoalToastPayload = useCallback(() => {
    const statusLine = isMonthlyGoalMet
      ? `Surplus ₹${formattedSurplusToGoal}`
      : `Need ₹${formattedRemainingToGoal} more`;

    return {
      title: `${monthLabel} savings progress`,
      description: `Target: ₹${formattedMonthlyGoal} • Saved: ₹${formattedMonthlyActual} • ${statusLine}`,
      duration: 5000,
    };
  }, [formattedMonthlyActual, formattedMonthlyGoal, formattedRemainingToGoal, formattedSurplusToGoal, isMonthlyGoalMet, monthLabel]);

  useEffect(() => {
    const snapshot = `${formattedMonthlyGoal}-${formattedMonthlyActual}-${isMonthlyGoalMet}`;

    if (lastGoalSnapshotRef.current === snapshot) {
      return;
    }

    lastGoalSnapshotRef.current = snapshot;

    if (goalToastRef.current?.dismiss) {
      goalToastRef.current.dismiss();
    }

    goalToastRef.current = showToast(
      isMonthlyGoalMet ? 'success' : 'info',
      buildGoalToastPayload()
    );
  }, [buildGoalToastPayload, formattedMonthlyActual, formattedMonthlyGoal, isMonthlyGoalMet]);

  useEffect(() => {
    return () => {
      if (goalToastRef.current?.dismiss) {
        goalToastRef.current.dismiss();
      }
    };
  }, []);

  const openExpenseEditModal = (expense) => {
    setEditingExpense(expense);
    setExpenseEditAmount(expense.amount.toString());
    setExpenseEditNotes(expense.notes || '');
    setExpenseEditDate(expense.date || new Date().toISOString().split('T')[0]);
  };

  const closeExpenseEditModal = () => {
    setEditingExpense(null);
    setExpenseEditAmount('');
    setExpenseEditNotes('');
    setExpenseEditDate(new Date().toISOString().split('T')[0]);
  };

  const handleExpenseUpdate = () => {
    if (!editingExpense) return;

    const parsed = Number.parseFloat(expenseEditAmount);
    if (!Number.isFinite(parsed) || parsed < 0) {
      showToast('warning', {
        title: 'Invalid expense amount',
        description: 'Please enter a non-negative number for the expense.',
        duration: 4000,
      });
      return;
    }

    const updatedExpense = {
      ...editingExpense,
      amount: parsed,
      notes: expenseEditNotes,
      date: expenseEditDate,
    };

    const updatedExpenses = expenses.map((exp) =>
      exp.id === updatedExpense.id ? updatedExpense : exp
    );

    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    showToast('success', {
      title: 'Expense updated',
      description: `${editingExpense.categoryName} now totals ₹${parsed.toFixed(2)}.`,
      duration: 4000,
    });

    closeExpenseEditModal();
  };

  const handleExpenseDelete = (expense) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== expense.id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    showToast('info', {
      title: 'Expense removed',
      description: `${expense.categoryName} entry deleted.`,
      duration: 4000,
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Categories Grid (Unchanged) */}
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{
              marginBottom: '6px',
              color: '#8B7FC7',
            }}>
              <FiPlus size={32} />
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
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

      {/* Income & Expense Card (Unchanged) */}
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
              onClick={openIncomeModal}
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
            {/* --- UPDATED: Shows all-time expenses --- */}
            <div style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#EF4444',
            }}>
              ₹{getTotalExpense().toFixed(2)}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (sortedExpenses.length > 0) {
                  openExpenseEditModal(sortedExpenses[0]);
                } else {
                  showToast('info', {
                    title: 'No expenses yet',
                    description: 'Add an expense before attempting to update it.',
                    duration: 4000,
                  });
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

      {/* Analytics Section (Unchanged) */}
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
                    {React.cloneElement(selectedBar.icon, { size: 24, color: '#8B7FC7' })}
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
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.3s',
                      }}>
                        {React.cloneElement(category.icon, { size: 20, color: '#2D3748' })}
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
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
                <FiTrendingDown size={48} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                No expenses yet
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                Start tracking your expenses to see analytics
              </div>
            </div>
          )}
        </div>

        {/* Income and Expense Cards (These are from the old code, I'll remove them as they are duplicates) */}
        
      </motion.div>

      {/* Recent expenses list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
            Recent Expenses
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#718096' }}>
            {sortedExpenses.length} entries
          </span>
        </div>

        {sortedExpenses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: '#718096',
            fontSize: '0.9rem',
          }}>
            No recorded expenses yet. Tap a category to add your first entry.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {sortedExpenses.slice(0, 8).map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid rgba(139, 127, 199, 0.2)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    color: '#2D3748',
                  }}>
                    <span>{expense.categoryName}</span>
                    <span style={{ color: '#8B7FC7' }}>₹{expense.amount.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                    {new Date(expense.date).toLocaleDateString()} • {expense.notes || 'No notes'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openExpenseEditModal(expense)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#8B7FC7',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExpenseDelete(expense)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#EF4444',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* --- UPDATED: Daily Savings Target --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#2D3748',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FiTarget size={20} /> Daily Savings Target
          </h2>
          {/* --- UPDATED: Button text and new button added --- */}
          <div style={{display: 'flex', gap: '8px'}}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openTargetModal}
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
              Set Target
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckMonthlySavings} // New function
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#10B981',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FiCalendar size={12} /> Check Monthly Goal
            </motion.button>
          </div>
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
            color: isMonthlyGoalMet ? '#10B981' : '#8B7FC7',
            marginBottom: '4px',
          }}>
            ₹{formattedMonthlyActual}
            <span style={{fontSize: '0.9rem', color: '#718096', fontWeight: '500', marginLeft: '8px'}}>/ per month</span>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.85rem',
            color: '#4B5563',
          }}>
            <div>
              Daily target: <strong>₹{formattedDailyTarget}</strong>
            </div>
            <div>
              Goal ({monthLabel}): <strong>₹{formattedMonthlyGoal}</strong>
            </div>
            <div style={{ color: isMonthlyGoalMet ? '#10B981' : '#EF4444', fontWeight: 600 }}>
              {isMonthlyGoalMet
                ? `Surplus: ₹${formattedSurplusToGoal}`
                : `Remaining: ₹${formattedRemainingToGoal}`}
            </div>
          </div>
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
                  Icon Name (from Feather Icons)
                </label>
                <input
                  type="text"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  placeholder="e.g., coffee, book, package"
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

      {/* Income modal */}
      <AnimatePresence>
        {isIncomeModalOpen && (
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
            onClick={closeIncomeModal}
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
                Update Monthly Income
              </h3>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Income Amount
                </label>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeIncomeModal}
                  style={{
                    padding: '10px 20px',
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleIncomeSave}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8B7FC7, #A78BFA)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 127, 199, 0.3)',
                  }}
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target modal */}
      <AnimatePresence>
        {isTargetModalOpen && (
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
            onClick={closeTargetModal}
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
                Set Daily Savings Target
              </h3>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Target Amount
                </label>
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeTargetModal}
                  style={{
                    padding: '10px 20px',
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTargetSave}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8B7FC7, #A78BFA)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 127, 199, 0.3)',
                  }}
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense edit modal */}
      <AnimatePresence>
        {editingExpense && (
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
            onClick={closeExpenseEditModal}
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
                maxWidth: '450px',
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
                Edit Expense
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4B5563',
                  marginBottom: '8px',
                }}>
                  Amount
                </label>
                <input
                  type="number"
                  value={expenseEditAmount}
                  onChange={(e) => setExpenseEditAmount(e.target.value)}
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
                  Notes
                </label>
                <textarea
                  value={expenseEditNotes}
                  onChange={(e) => setExpenseEditNotes(e.target.value)}
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

              <div style={{ marginBottom: '24px' }}>
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
                  value={expenseEditDate}
                  onChange={(e) => setExpenseEditDate(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeExpenseEditModal}
                  style={{
                    padding: '10px 20px',
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExpenseUpdate}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8B7FC7, #A78BFA)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 127, 199, 0.3)',
                  }}
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {isResetConfirmOpen && (
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
            onClick={cancelReset}
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
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(139, 127, 199, 0.2)',
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#EF4444',
                  fontWeight: 600,
                }}>
                  <FiAlertTriangle size={20} />
                  <span>Reset financial data?</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#4B5563', lineHeight: 1.5 }}>
                  This will clear all recorded expenses, income, and your savings target. You can't undo this action. Are you sure you want to reset your financial data?
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelReset}
                    style={{
                      padding: '10px 20px',
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmReset}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #EF4444, #F97316)',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    Reset
                  </motion.button>
                </div>
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
                <div style={{}}>{selectedCategory?.icon}</div>
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

      {/* Responsive Styles (Unchanged) */}
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