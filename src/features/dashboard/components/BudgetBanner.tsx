import { useState } from 'react';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { isSameMonth, parseISO } from 'date-fns';
import { AlertCircle, AlertTriangle, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BudgetBanner = () => {
  const { transactions, budget, setBudget } = useFinanceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.toString());

  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && isSameMonth(parseISO(t.date), new Date()))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const usagePercent = budget > 0 ? (currentMonthExpenses / budget) * 100 : 0;
  
  const handleSave = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val >= 0) {
      setBudget(val);
    }
    setIsEditing(false);
  };

  const getStatus = () => {
    if (usagePercent > 100) return 'exceeded';
    if (usagePercent > 80) return 'warning';
    return 'safe';
  };

  const status = getStatus();

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">Monthly Budget</h2>
        <div className="flex items-center gap-2">
           {isEditing ? (
             <div className="flex items-center gap-2">
               <input 
                 type="number" 
                 value={budgetInput}
                 onChange={(e) => setBudgetInput(e.target.value)}
                 className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-teal-500 text-zinc-900 dark:text-zinc-100"
                 autoFocus
               />
               <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="p-1 rounded bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-500 dark:hover:bg-teal-500/20 transition-colors">
                 <Check className="w-4 h-4" />
               </motion.button>
             </div>
           ) : (
             <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">${budget.toLocaleString()}</span>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setBudgetInput(budget.toString()); setIsEditing(true); }} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </motion.button>
             </div>
           )}
        </div>
      </div>

      <AnimatePresence>
        {status !== 'safe' && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border overflow-hidden ${
              status === 'exceeded' 
                ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400' 
                : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400'
            }`}
          >
            {status === 'exceeded' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold text-sm sm:text-base">
                {status === 'exceeded' ? `⚠️ You exceeded your budget by $${(currentMonthExpenses - budget).toLocaleString()}` : `You have used ${usagePercent.toFixed(1)}% of your budget`}
              </p>
              <p className="text-xs sm:text-sm opacity-80 mt-1">
                {status === 'exceeded' 
                  ? "Consider reviewing your latest expenses to stay on track next month."
                  : "You're getting close to your limit for this month."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
