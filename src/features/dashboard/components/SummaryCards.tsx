import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { motion } from 'framer-motion';

export const SummaryCards = () => {
  const transactions = useFinanceStore(state => state.transactions);

  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      icon: Wallet,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
    },
    {
      title: 'Total Income',
      amount: income,
      icon: ArrowUpRight,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Expense',
      amount: expense,
      icon: ArrowDownRight,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Card animateHover className="relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  ${card.amount.toLocaleString()}
                </h3>
              </div>
              <div className={`p-4 rounded-2xl ${card.bgColor} ${card.color}`}>
                <card.icon className="w-8 h-8" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
