import { useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { TrendingUp, TrendingDown, Target, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { isSameMonth, subMonths, parseISO } from 'date-fns';

export const InsightCards = () => {
  const transactions = useFinanceStore(state => state.transactions);

  const insights = useMemo(() => {
    const today = new Date();
    const lastMonthRaw = subMonths(today, 1);

    // This Month
    const thisMonthTx = transactions.filter(t => isSameMonth(parseISO(t.date), today));
    const thisMonthExpenses = thisMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const thisMonthIncome = thisMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

    // Last Month
    const lastMonthTx = transactions.filter(t => isSameMonth(parseISO(t.date), lastMonthRaw));
    const lastMonthExpenses = lastMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    // Top Category this month
    const categories = thisMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let topCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(categories).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topCategory = cat;
      }
    });

    // % Change
    let spendingInsight = {
      title: 'Spending Trend',
      description: 'Not enough data from last month to compare.',
      value: 'N/A',
      icon: TrendingUp,
      color: 'text-zinc-500',
      bg: 'bg-zinc-500/10'
    };

    if (lastMonthExpenses > 0) {
      const diff = thisMonthExpenses - lastMonthExpenses;
      const percent = (diff / lastMonthExpenses) * 100;
      if (percent > 0) {
        spendingInsight = {
          title: 'Spending Increased',
          description: `You spent ${percent.toFixed(0)}% more than last month.`,
          value: `+${percent.toFixed(0)}%`,
          icon: TrendingUp,
          color: 'text-red-500',
          bg: 'bg-red-500/10'
        };
      } else if (percent < 0) {
        spendingInsight = {
          title: 'Spending Decreased',
          description: `Great! You spent ${Math.abs(percent).toFixed(0)}% less than last month.`,
          value: `${percent.toFixed(0)}%`,
          icon: TrendingDown,
          color: 'text-green-500',
          bg: 'bg-green-500/10'
        };
      } else {
        spendingInsight = {
          title: 'Stable Spending',
          description: `Your spending is exactly the same as last month.`,
          value: '0%',
          icon: Target,
          color: 'text-zinc-500',
          bg: 'bg-zinc-500/10'
        };
      }
    } else if (thisMonthExpenses > 0 && lastMonthExpenses === 0) {
      spendingInsight = {
        title: 'New Spending',
        description: `Your expenses started tracking this month.`,
        value: `$${thisMonthExpenses.toLocaleString()}`,
        icon: TrendingUp,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
      };
    }

    const netSavings = thisMonthIncome - thisMonthExpenses;
    
    return [
      spendingInsight,
      {
        title: 'Top Category',
        description: topCategoryAmount > 0 ? `Your highest spending category is ${topCategory}.` : 'No expenses recorded this month.',
        value: topCategoryAmount > 0 ? `$${topCategoryAmount.toLocaleString()}` : '$0',
        icon: Target,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
      },
      {
        title: 'Net Savings',
        description: netSavings > 0 ? `You saved $${netSavings.toLocaleString()} this month.` : netSavings < 0 ? `You overspent your income by $${Math.abs(netSavings).toLocaleString()}` : 'You broke even this month.',
        value: netSavings >= 0 ? `+$${netSavings.toLocaleString()}` : `-$${Math.abs(netSavings).toLocaleString()}`,
        icon: Zap,
        color: netSavings > 0 ? 'text-teal-500' : netSavings < 0 ? 'text-red-500' : 'text-zinc-500',
        bg: netSavings > 0 ? 'bg-teal-500/10' : netSavings < 0 ? 'bg-red-500/10' : 'bg-zinc-500/10'
      }
    ];
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {insights.map((insight, idx) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
        >
          <Card className="h-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group">
            <div className="flex flex-col h-full items-start gap-4">
              <div className={`p-3 rounded-xl ${insight.bg} ${insight.color} shrink-0`}>
                <insight.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-100">{insight.title}</h3>
                <div className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">{insight.value}</div>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{insight.description}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
      
      <Card className="md:col-span-3 border border-dashed border-zinc-300 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-950/30 flex items-center gap-4 p-6 hover:bg-zinc-100 dark:hover:bg-zinc-950/60 transition-colors">
         <AlertTriangle className="w-8 h-8 text-zinc-400 dark:text-zinc-600 shrink-0" />
         <div>
            <h4 className="text-zinc-900 dark:text-zinc-300 font-medium">Connect more accounts</h4>
            <p className="text-sm text-zinc-500 mt-1">Link your bank accounts to get AI-powered insights automatically synced.</p>
         </div>
      </Card>
    </div>
  );
};
