import { SummaryCards } from '../features/dashboard/components/SummaryCards';
import { BudgetBanner } from '../features/dashboard/components/BudgetBanner';
import { FinanceCharts } from '../features/dashboard/components/FinanceCharts';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Overview</h1>
      </div>
      <BudgetBanner />
      <SummaryCards />
      <FinanceCharts />
    </motion.div>
  );
};
